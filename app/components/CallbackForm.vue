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
 */
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CALLBACK_COPY, BEST_TIME_VALUES, type Locale } from '../data/callbackFormCopy'
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
  bestTime: '',
  specificTime: '',
  email: '',
  phone: '',
  countryCode: 'US',
  consent: false,
})

const submitting = ref(false)
const done = ref(false)
const errorMessage = ref('')

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
    !!form.bestTime &&
    !!form.phone.trim() &&
    (!needsSpecificTime.value || !!form.specificTime.trim()),
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

  const rep = props.rep || ''
  const pageTitle = typeof document !== 'undefined' ? document.title : ''

  // 1) ClickUp (Turnstile is verified inside this endpoint).
  const toClickUp = $fetch<{ ok?: boolean }>('/api/callback-lead', {
    method: 'POST',
    body: {
      token: turnstileToken.value,
      rep,
      locale: locale.value,
      name: form.name,
      email: form.email,
      phone: form.phone,
      details: form.details,
      bestTime: form.bestTime,
      bestTimeLabel: bestTimeLabel.value,
      specificTime: form.specificTime,
      consent: form.consent,
      pageTitle,
      utm: utm.value,
    },
  }).then((r) => r?.ok === true)

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
      subject: `New call-back lead — ${rep || 'direct'}`,
      name: form.name,
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      phone: form.phone,
      message: form.details,
      referred_by: rep || 'direct (no rep link)',
      language: locale.value === 'es' ? 'Spanish' : 'English',
      best_time_to_call: bestTimeLabel.value,
      ...(form.specificTime ? { requested_time: form.specificTime } : {}),
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
    done.value = true
    gtmPush({
      event: 'generate_lead',
      form_id: 'callback_form',
      referred_by: rep || 'direct',
      language: locale.value,
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
    <p v-if="done" class="cb__success" role="status">{{ t.success }}</p>

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
.cb__field label {
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
