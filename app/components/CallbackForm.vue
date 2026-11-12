<script setup lang="ts">
/**
 * Rep call-back form — the body of /forms/callback/[rep].
 *
 * Bilingual on a single page: the initial locale is resolved SERVER-side from the
 * Accept-Language header (so there's no English flash before switching) and can be
 * overridden by the EN/ES toggle.
 *
 * Two independent submissions, on purpose:
 *   1. POST /api/callback-lead  → verifies Turnstile, creates the ClickUp task
 *   2. POST api.web3forms.com   → email copy to sales@
 * They run in parallel and neither blocks the other, so a ClickUp outage still
 * produces the email. Success is shown if EITHER leg lands the lead.
 *
 * Out-of-state leads (any state other than Georgia) get the extra intake fields of
 * the ClickUp "Out of State Lead Form". Their values stay in memory if the visitor
 * flips back to Georgia but are never submitted in Georgia mode. Attachments are
 * uploaded one per request to /api/callback-attachment once the task exists.
 */
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CALLBACK_COPY, BEST_TIME_VALUES, MAX_ATTACHMENTS, type Locale } from '../data/callbackFormCopy'
import { US_STATES } from '../data/usStates'
import { countries } from '../data/countries'
import { useTurnstile } from '../composables/useTurnstile'
import { useDataLayer } from '../composables/useDataLayer'

const props = defineProps<{ rep?: string | null }>()

const config = useRuntimeConfig()
const route = useRoute()
const { push: gtmPush } = useDataLayer()
const { token: turnstileToken, reset: resetTurnstile } = useTurnstile('callback-turnstile')

// ── Locale: detected on the server, overridable by the toggle ────────────────
function detectLocale(header: string): Locale {
  const first = String(header || '').split(',')[0]?.trim().toLowerCase() || ''
  return first.startsWith('es') ? 'es' : 'en'
}
const acceptLanguage = import.meta.server
  ? useRequestHeaders(['accept-language'])['accept-language'] || ''
  : ''
const locale = useState<Locale>('callback-locale', () => detectLocale(acceptLanguage))
const t = computed(() => CALLBACK_COPY[locale.value])

// Function form so <html lang> actually re-renders when the toggle flips.
useHead(() => ({ htmlAttrs: { lang: locale.value } }))

// ── Form state ───────────────────────────────────────────────────────────────
const form = reactive({
  name: '',
  details: '',
  state: '',
  accidentDate: '',
  bestTime: '',
  specificTime: '',
  email: '',
  phone: '',
  countryCode: 'US',
  consent: false,
  // Out-of-state only
  hospital: '',
  injuries: '',
  policeReport: '',
  address: '',
  language: '',
  additionalInfo: '',
})

/** Any chosen state except Georgia. No state yet = the normal (Georgia) form. */
const isOutOfState = computed(() => !!form.state && form.state !== 'Georgia')

// ── Attachments (out-of-state only) ─────────────────────────────────────────
// Each file goes up in its own request and Vercel caps a request at ~4.5 MB, so
// files must stay under 4 MB; large photos are shrunk in the browser first.
const MAX_FILE_BYTES = 4 * 1024 * 1024
const ACCEPTED_TYPE = /^(image\/|application\/pdf$|application\/msword$|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$|text\/plain$)/
const ACCEPT_ATTR = 'image/*,.pdf,.doc,.docx,.txt'

const files = ref<File[]>([])
const fileError = ref('')
const dragging = ref(false)
const attachmentsFailed = ref(false)

/** Re-encode a photo as JPEG at a smaller size. Rejects if the browser can't decode it. */
async function shrinkImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  for (const [maxSide, quality] of [[2400, 0.82], [1600, 0.72]] as const) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', quality))
    if (blob && blob.size <= MAX_FILE_BYTES) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
    }
  }
  throw new Error('too-large')
}

async function addFiles(list: FileList | File[] | null | undefined) {
  fileError.value = ''
  let rejected = false
  for (const original of Array.from(list || [])) {
    if (files.value.length >= MAX_ATTACHMENTS) {
      fileError.value = t.value.errorTooManyFiles
      return
    }
    if (!ACCEPTED_TYPE.test(original.type)) {
      rejected = true
      continue
    }
    let file: File | null = original
    if (file.size > MAX_FILE_BYTES) {
      file = file.type.startsWith('image/') ? await shrinkImage(file).catch(() => null) : null
    }
    if (file) files.value.push(file)
    else rejected = true
  }
  if (rejected) fileError.value = t.value.errorFile
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  addFiles(input.files)
  input.value = '' // allow re-picking the same file after removing it
}

function onDrop(e: DragEvent) {
  dragging.value = false
  addFiles(e.dataTransfer?.files)
}

function removeFile(i: number) {
  files.value.splice(i, 1)
  fileError.value = ''
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function uploadAttachments(taskId: string, token: string): Promise<boolean> {
  let allOk = true
  for (const file of files.value) {
    const body = new FormData()
    body.append('taskId', taskId)
    body.append('token', token)
    body.append('file', file, file.name)
    const ok = await $fetch<{ ok?: boolean }>('/api/callback-attachment', { method: 'POST', body })
      .then((r) => r?.ok === true)
      .catch(() => false)
    if (!ok) allOk = false
  }
  return allOk
}

const submitting = ref(false)
const done = ref(false)
const errorMessage = ref('')

// The country selector's dial code was being dropped: ClickUp's `phone` field and
// the sales team both need the full international number, not bare local digits.
const dialCode = computed(() => countries.find((c) => c.code === form.countryCode)?.dial ?? '+1')

/** Canonical ENGLISH label — the CRM field must hold one consistent vocabulary,
 *  otherwise Spanish leads store "Lo antes posible" and can't be filtered with the rest. */
const bestTimeLabelEn = computed(
  () => CALLBACK_COPY.en.bestTimeOptions.find((o) => o.value === form.bestTime)?.label ?? form.bestTime,
)

const needsSpecificTime = computed(() => form.bestTime === BEST_TIME_VALUES.specific)

// Clear the conditional value when it's no longer relevant, so a stale time can't
// be submitted after switching back to "as soon as possible".
watch(needsSpecificTime, (needed) => {
  if (!needed) form.specificTime = ''
})

const filledRequired = computed(
  () =>
    !!form.name.trim() &&
    !!form.details.trim() &&
    !!form.state &&
    !!form.bestTime &&
    !!form.phone.trim() &&
    (!needsSpecificTime.value || !!form.specificTime.trim()) &&
    (!isOutOfState.value ||
      (!!form.hospital.trim() &&
        !!form.injuries.trim() &&
        !!form.policeReport.trim() &&
        !!form.address.trim() &&
        !!form.language)),
)
const canSubmit = computed(
  () => filledRequired.value && form.consent && !submitting.value && !!turnstileToken.value,
)

/** utm_* (and gclid/fbclid) off the query string — the rep lives in the path. */
const utm = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(route.query)) {
    if (/^utm_/i.test(k) || /^(gclid|fbclid|msclkid)$/i.test(k)) {
      out[k.toLowerCase()] = Array.isArray(v) ? String(v[0]) : String(v ?? '')
    }
  }
  return out
})

const bestTimeLabel = computed(
  () => t.value.bestTimeOptions.find((o) => o.value === form.bestTime)?.label ?? form.bestTime,
)

async function submitForm() {
  errorMessage.value = ''
  if (!filledRequired.value) {
    errorMessage.value = t.value.errorRequired
    return
  }
  if (!form.consent) {
    errorMessage.value = t.value.errorConsent
    return
  }
  submitting.value = true
  attachmentsFailed.value = false

  // Snapshot the out-of-state values ONLY in out-of-state mode — anything typed
  // before switching back to Georgia is left out of both submissions.
  const outOfState = isOutOfState.value
  const languageLabelEn = CALLBACK_COPY.en.languageOptions.find((o) => o.value === form.language)?.label ?? ''
  const oos = outOfState
    ? {
        hospital: form.hospital.trim(),
        injuries: form.injuries.trim(),
        policeReport: form.policeReport.trim(),
        address: form.address.trim(),
        language: form.language,
        additionalInfo: form.additionalInfo.trim(),
        attachmentCount: files.value.length,
      }
    : null

  const rep = props.rep || ''
  const pageTitle = typeof document !== 'undefined' ? document.title : ''

  // 1) ClickUp (Turnstile is verified inside this endpoint).
  const toClickUp = $fetch<{ ok?: boolean; taskId?: string; attachmentToken?: string }>('/api/callback-lead', {
    method: 'POST',
    body: {
      token: turnstileToken.value,
      rep,
      locale: locale.value,
      name: form.name,
      email: form.email,
      phone: form.phone,
      dialCode: dialCode.value,
      details: form.details,
      state: form.state,
      accidentDate: form.accidentDate,
      bestTime: form.bestTime,
      bestTimeLabel: bestTimeLabelEn.value,
      bestTimeLabelLocal: bestTimeLabel.value,
      specificTime: form.specificTime,
      consent: form.consent,
      pageTitle,
      utm: utm.value,
      ...(oos || {}),
    },
  }).then(async (r) => {
    if (r?.ok !== true) return false
    // Attachments need the task to exist; a failed upload doesn't lose the lead.
    if (oos && files.value.length) {
      const uploaded = r.taskId && r.attachmentToken ? await uploadAttachments(r.taskId, r.attachmentToken) : false
      if (!uploaded) attachmentsFailed.value = true
    }
    return true
  })

  // 2) Email copy. Independent of ClickUp — this is the redundancy leg, and it
  //    carries the attribution so a failed API call still yields an attributed lead.
  const toEmail = fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key:
        config.public.web3FormsKeyCallback ||
        config.public.web3FormsKeyLeads ||
        config.public.web3FormsKey,
      form_id: 'callback_form',
      subject: `New call-back lead — ${rep || 'direct'}${outOfState ? ` — out of state (${form.state})` : ''}`,
      name: form.name,
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      phone: `${dialCode.value} ${form.phone}`,
      message: form.details,
      state: form.state,
      ...(form.accidentDate ? { date_of_accident: form.accidentDate } : {}),
      referred_by: rep || 'direct (no rep link)',
      language: locale.value === 'es' ? 'Spanish' : 'English',
      best_time_to_call: bestTimeLabel.value,
      ...(form.specificTime ? { requested_time: form.specificTime } : {}),
      ...(oos
        ? {
            hospital: oos.hospital,
            injuries: oos.injuries,
            police_report: oos.policeReport,
            address: oos.address,
            primary_language: languageLabelEn,
            ...(oos.additionalInfo ? { additional_info: oos.additionalInfo } : {}),
            attachments: files.value.length
              ? `${files.value.map((f) => f.name).join(', ')} (uploaded to the ClickUp task)`
              : 'none',
          }
        : {}),
      consent_given: 'yes',
      page: pageTitle,
      ...utm.value,
    }),
  })
    .then((r) => r.json())
    .then((r) => r?.success === true)

  const [clickup, email] = await Promise.allSettled([toClickUp, toEmail])
  const clickupOk = clickup.status === 'fulfilled' && clickup.value === true
  const emailOk = email.status === 'fulfilled' && email.value === true

  submitting.value = false

  if (clickupOk || emailOk) {
    if (outOfState && files.value.length && !clickupOk) attachmentsFailed.value = true
    done.value = true
    gtmPush({
      event: 'generate_lead',
      form_id: 'callback_form',
      referred_by: rep || 'direct',
      language: locale.value,
      out_of_state: outOfState,
      clickup_ok: clickupOk,
      email_ok: emailOk,
    })
    return
  }

  errorMessage.value = t.value.errorGeneric
  resetTurnstile()
}
</script>

<template>
  <div class="cb">
    <!-- Language toggle: device language is a guess, never a lock-in. -->
    <div class="cb__lang" role="group" aria-label="Language / Idioma">
      <button
        v-for="l in (['en', 'es'] as Locale[])"
        :key="l"
        type="button"
        class="cb__lang-btn"
        :class="{ 'is-active': locale === l }"
        :aria-pressed="locale === l"
        @click="locale = l"
      >
        {{ CALLBACK_COPY[l].langLabel }}
      </button>
    </div>

    <h1 class="cb__title">{{ t.title }}</h1>
    <p class="cb__intro">{{ t.intro }}</p>

    <!-- Success replaces the form entirely: nothing left to do on this page. -->
    <template v-if="done">
      <p class="cb__success" role="status">{{ t.success }}</p>
      <p v-if="attachmentsFailed" class="cb__notice" role="status">{{ t.attachmentsPartial }}</p>
    </template>

    <form v-else class="cb__form" novalidate @submit.prevent="submitForm">
      <div class="cb__field">
        <label for="cb-name">{{ t.nameLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
        <input id="cb-name" v-model="form.name" type="text" :placeholder="t.namePlaceholder" autocomplete="name" required />
      </div>

      <div class="cb__field">
        <label for="cb-details">{{ t.detailsLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
        <textarea id="cb-details" v-model="form.details" rows="4" :placeholder="t.detailsPlaceholder" required />
      </div>

      <div class="cb__field">
        <label for="cb-state">{{ t.stateLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
        <div class="cb__select-wrap">
          <select id="cb-state" v-model="form.state" required>
            <option value="" disabled>{{ t.statePlaceholder }}</option>
            <option v-for="st in US_STATES" :key="st" :value="st">{{ st }}</option>
          </select>
          <svg class="cb__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div class="cb__field">
        <label for="cb-accident-date">{{ t.accidentDateLabel }} <span class="cb__optional">({{ t.optional }})</span></label>
        <input id="cb-accident-date" v-model="form.accidentDate" type="date" />
      </div>

      <div class="cb__field">
        <label for="cb-time">{{ t.bestTimeLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
        <div class="cb__select-wrap">
          <select id="cb-time" v-model="form.bestTime" required>
            <option value="" disabled>{{ t.bestTimePlaceholder }}</option>
            <option v-for="o in t.bestTimeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <svg class="cb__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <!-- Conditional: only when "Specific date & time" is chosen. -->
      <div v-if="needsSpecificTime" class="cb__field">
        <label for="cb-specific">{{ t.specificTimeLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
        <input id="cb-specific" v-model="form.specificTime" type="text" :placeholder="t.specificTimePlaceholder" required />
      </div>

      <div class="cb__field">
        <label for="cb-email">{{ t.emailLabel }} <span class="cb__optional">({{ t.optional }})</span></label>
        <input id="cb-email" v-model="form.email" type="email" :placeholder="t.emailPlaceholder" autocomplete="email" />
      </div>

      <div class="cb__field">
        <label for="cb-phone">{{ t.phoneLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
        <AppPhoneInput
          v-model:phone="form.phone"
          v-model:code="form.countryCode"
          variant="contact"
          input-id="cb-phone"
          :placeholder="t.phonePlaceholder"
        />
      </div>

      <!-- Out-of-state intake: only for states other than Georgia. -->
      <template v-if="isOutOfState">
        <div class="cb__field">
          <label for="cb-hospital">{{ t.hospitalLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
          <textarea id="cb-hospital" v-model="form.hospital" rows="2" :placeholder="t.namePlaceholder" required />
        </div>

        <div class="cb__field">
          <label for="cb-injuries">{{ t.injuriesLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
          <textarea id="cb-injuries" v-model="form.injuries" rows="3" :placeholder="t.namePlaceholder" required />
        </div>

        <div class="cb__field">
          <label for="cb-police">{{ t.policeReportLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
          <input id="cb-police" v-model="form.policeReport" type="text" :placeholder="t.policeReportPlaceholder" required />
        </div>

        <div class="cb__field">
          <label for="cb-address">{{ t.addressLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
          <textarea id="cb-address" v-model="form.address" rows="2" :placeholder="t.namePlaceholder" autocomplete="street-address" required />
        </div>

        <div class="cb__field">
          <label for="cb-language">{{ t.languageLabel }}<span class="cb__req" aria-hidden="true">*</span></label>
          <div class="cb__select-wrap">
            <select id="cb-language" v-model="form.language" required>
              <option value="" disabled>{{ t.languagePlaceholder }}</option>
              <option v-for="o in t.languageOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <svg class="cb__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div class="cb__field">
          <span id="cb-attachments-label" class="cb__label">{{ t.attachmentsLabel }} <span class="cb__optional">({{ t.optional }})</span></span>
          <label
            class="cb__drop"
            :class="{ 'is-dragging': dragging }"
            aria-labelledby="cb-attachments-label"
            @dragenter.prevent="dragging = true"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <input type="file" class="cb__drop-input" multiple :accept="ACCEPT_ATTR" @change="onFileInput" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>{{ t.attachmentsDrop }} <u>{{ t.attachmentsBrowse }}</u></span>
            <small>{{ t.attachmentsHint }}</small>
          </label>
          <ul v-if="files.length" class="cb__files">
            <li v-for="(f, i) in files" :key="`${f.name}-${i}`">
              <span class="cb__file-name">{{ f.name }}</span>
              <span class="cb__file-size">{{ formatSize(f.size) }}</span>
              <button type="button" class="cb__file-remove" :aria-label="`${t.attachmentsRemove} ${f.name}`" @click="removeFile(i)">×</button>
            </li>
          </ul>
          <p v-if="fileError" class="cb__field-error" role="alert">{{ fileError }}</p>
        </div>

        <div class="cb__field">
          <label for="cb-additional">{{ t.additionalInfoLabel }} <span class="cb__optional">({{ t.optional }})</span></label>
          <p id="cb-additional-help" class="cb__help">{{ t.additionalInfoHelp }}</p>
          <textarea id="cb-additional" v-model="form.additionalInfo" rows="3" :placeholder="t.namePlaceholder" aria-describedby="cb-additional-help" />
        </div>
      </template>

      <div class="cb__consent">
        <AppCheckbox v-model="form.consent">
          <strong>{{ t.consentLabel }}<span class="cb__req" aria-hidden="true">*</span></strong>
        </AppCheckbox>
        <p class="cb__consent-text">{{ t.consentText }}</p>
      </div>

      <div id="callback-turnstile" class="cb__turnstile" />

      <button type="submit" class="cb__submit" :disabled="!canSubmit">
        {{ submitting ? t.submitting : t.submit }}
      </button>

      <p v-if="errorMessage" class="cb__error" role="alert">{{ errorMessage }}</p>
    </form>

    <p class="cb__disclaimer">{{ t.disclaimer }}</p>
  </div>
</template>

<style scoped>
.cb {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  padding: 28px 20px 48px;
}

.cb__lang { display: flex; justify-content: flex-end; gap: 6px; margin-bottom: 18px; }
.cb__lang-btn {
  min-width: 44px;
  padding: 7px 12px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all var(--transition-base);
}
.cb__lang-btn.is-active {
  background: var(--color-dark);
  border-color: var(--color-dark);
  color: #fff;
}

.cb__title {
  font-family: var(--font-secondary);
  font-size: clamp(1.55rem, 5vw, 2.1rem);
  font-weight: 700;
  line-height: 1.18;
  color: var(--color-dark);
  margin: 0 0 10px;
}
.cb__intro {
  font-family: var(--font-primary);
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-muted);
  margin: 0 0 26px;
}

.cb__form { display: flex; flex-direction: column; gap: 18px; }

.cb__field { display: flex; flex-direction: column; gap: 7px; }
.cb__field label,
.cb__label {
  font-family: var(--font-primary);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--color-dark);
}
.cb__req { color: #dc2626; margin-left: 2px; }
.cb__optional { font-weight: 400; color: var(--color-muted); }

.cb__field input,
.cb__field textarea {
  width: 100%;
  padding: 13px 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 16px; /* 16px prevents iOS zoom-on-focus */
  color: var(--color-dark);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.cb__field input::placeholder,
.cb__field textarea::placeholder { color: #9a9a9a; }
.cb__field input:focus,
.cb__field textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(243, 175, 0, 0.18);
}
.cb__field textarea { resize: vertical; line-height: 1.55; }

.cb__select-wrap { position: relative; }
.cb__select-wrap select {
  width: 100%;
  padding: 13px 40px 13px 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 16px;
  color: var(--color-dark);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.cb__select-wrap select:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(243, 175, 0, 0.18);
}
.cb__chevron {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #525252;
  pointer-events: none;
}

/* ── Out-of-state extras ── */
.cb__help {
  font-family: var(--font-primary);
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-muted);
  margin: -2px 0 2px;
}
.cb__field .cb__drop {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 22px 16px;
  text-align: center;
  font-family: var(--font-primary);
  font-size: 14.5px;
  font-weight: 400;
  color: var(--color-dark);
  background: #fff;
  border: 1.5px dashed rgba(0, 0, 0, 0.22);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--transition-base), background var(--transition-base);
}
.cb__drop svg { color: #525252; }
.cb__drop small { font-size: 12.5px; color: var(--color-muted); }
.cb__drop.is-dragging,
.cb__drop:hover { border-color: var(--color-accent); background: rgba(243, 175, 0, 0.06); }
.cb__drop:focus-within { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(243, 175, 0, 0.18); }
.cb__field .cb__drop-input {
  /* Beats `.cb__field input` above, which would otherwise stretch this hidden input. */
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  opacity: 0;
  overflow: hidden;
}
.cb__files { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.cb__files li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 12px;
  font-family: var(--font-primary);
  font-size: 13.5px;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
}
.cb__file-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-dark); }
.cb__file-size { flex-shrink: 0; color: var(--color-muted); font-size: 12.5px; }
.cb__file-remove {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  font-size: 18px;
  line-height: 1;
  color: #525252;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
.cb__file-remove:hover { background: rgba(0, 0, 0, 0.07); }
.cb__field-error { font-family: var(--font-primary); font-size: 13px; color: #dc2626; margin: 0; }
.cb__notice {
  font-family: var(--font-primary);
  font-size: 14px;
  line-height: 1.55;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin: 12px 0 0;
}

.cb__consent { display: flex; flex-direction: column; gap: 8px; }
/* AppCheckbox hardcodes white text for the dark hero forms; this page is light. */
.cb__consent :deep(.app-checkbox__text),
.cb__consent :deep(.app-checkbox__text a) { color: var(--color-dark); }
.cb__consent-text {
  font-family: var(--font-primary);
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--color-muted);
  margin: 0;
}

.cb__turnstile:empty { display: none; }

.cb__submit {
  width: 100%;
  padding: 16px 24px;
  background: var(--color-accent);
  color: var(--color-dark);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.cb__submit:hover:not(:disabled) { transform: translateY(-2px); }
.cb__submit:disabled { opacity: 0.55; cursor: not-allowed; }

.cb__success {
  font-family: var(--font-primary);
  font-size: 16px;
  line-height: 1.6;
  color: #15803d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-sm);
  padding: 20px;
  margin: 0;
}
.cb__error {
  font-family: var(--font-primary);
  font-size: 14px;
  color: #dc2626;
  text-align: center;
  margin: 0;
}

.cb__disclaimer {
  font-family: var(--font-primary);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--color-muted);
  margin: 28px 0 0;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
