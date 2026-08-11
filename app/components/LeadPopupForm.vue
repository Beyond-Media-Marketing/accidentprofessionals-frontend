<script setup lang="ts">
/**
 * Site-wide timed lead-capture popup.
 *
 * Mounted once in layouts/site.vue. Everything about it — copy, delay, whether
 * it runs on mobile at all, and the master on/off switch — is driven by the
 * `lead-popup` single-type in Strapi, so it can be tuned or killed without a deploy.
 *
 * Submission mirrors LeadForm.vue exactly: Turnstile is verified against our own
 * /api/verify-captcha first (Web3Forms' free plan rejects payloads carrying a
 * `cf-turnstile-response` field), then the lead posts to Web3Forms from the browser.
 */
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useDataLayer } from '../composables/useDataLayer'
import { useTurnstile } from '../composables/useTurnstile'

const STORAGE_KEY = 'ap_lead_popup_seen'

const config = useRuntimeConfig()
const route = useRoute()
const { push: gtmPush } = useDataLayer()
// Deliberately NOT awaited: a top-level await here would turn this into an async
// component inside the layout. `schedule()` runs on mount and again via watch(cfg)
// once the config lands, so either resolution order works.
const { data: cfg } = useLeadPopup()
const { token: turnstileToken, reset: resetTurnstile, verify: verifyTurnstile } =
  useTurnstile('leadpopup-turnstile')

const open = ref(false)
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  countryCode: 'US',
  details: '',
})

// ── Copy (CMS with sensible fallbacks) ───────────────────────────────────────
const text = computed(() => ({
  eyebrow: cfg.value?.eyebrow || 'Free Case Review',
  heading: cfg.value?.heading || 'Injured in an Accident?',
  headingAccent: cfg.value?.headingAccent || '',
  subheading:
    cfg.value?.subheading ||
    'Tell us what happened and a vetted Georgia attorney will review your case at no cost.',
  submitLabel: cfg.value?.submitLabel || 'Get My Free Case Review',
  success: cfg.value?.successMessage || "Thank you — we'll be in touch shortly.",
  disclaimer: cfg.value?.disclaimer || '',
}))

// Name + phone are the only blocking fields: this is an interruption, so every
// extra required field costs conversions. Email is optional here for the same
// reason it was made optional on the service and contact forms.
const canSubmit = computed(
  () => !!form.name.trim() && !!form.phone.trim() && !submitting.value && !!turnstileToken.value,
)

// ── Trigger ──────────────────────────────────────────────────────────────────
let timer: ReturnType<typeof setTimeout> | null = null
let lastFocused: HTMLElement | null = null

function alreadySeen(): boolean {
  const freq = cfg.value?.frequency ?? 'session'
  if (freq === 'always') return false
  try {
    const store = freq === 'once' ? window.localStorage : window.sessionStorage
    return store.getItem(STORAGE_KEY) === '1'
  } catch {
    // Private mode / storage blocked — fail toward NOT nagging the visitor.
    return true
  }
}

function markSeen() {
  const freq = cfg.value?.frequency ?? 'session'
  if (freq === 'always') return
  try {
    const store = freq === 'once' ? window.localStorage : window.sessionStorage
    store.setItem(STORAGE_KEY, '1')
  } catch {
    /* storage unavailable — nothing to persist */
  }
}

function isExcluded(): boolean {
  const raw = cfg.value?.excludePaths
  const paths: string[] = Array.isArray(raw) ? raw : []
  const here = route.path.replace(/\/+$/, '') || '/'
  return paths.some((p) => String(p).replace(/\/+$/, '') === here)
}

function schedule() {
  if (timer) clearTimeout(timer)
  if (!import.meta.client) return
  if (!cfg.value?.enabled) return
  if (isExcluded() || alreadySeen()) return

  const isMobile = window.matchMedia('(max-width: 767px)').matches
  if (isMobile && cfg.value?.showOnMobile === false) return

  const raw = isMobile ? cfg.value?.mobileDelaySeconds : cfg.value?.delaySeconds
  const seconds = Number.isFinite(Number(raw)) ? Number(raw) : 3
  timer = setTimeout(() => {
    // Re-check: the visitor may have navigated onto an excluded page while waiting.
    if (!isExcluded() && !alreadySeen()) show()
  }, Math.max(0, seconds) * 1000)
}

async function show() {
  open.value = true
  markSeen()
  gtmPush({ event: 'lead_popup_shown', page_title: document.title, page_path: route.path })

  lastFocused = document.activeElement as HTMLElement | null
  document.body.style.overflow = 'hidden'
  await nextTick()
  dialogEl.value?.querySelector<HTMLElement>('input, textarea, button')?.focus()
}

function close(reason: string) {
  if (!open.value) return
  open.value = false
  document.body.style.overflow = ''
  gtmPush({ event: 'lead_popup_dismissed', dismiss_reason: reason })
  lastFocused?.focus?.()
}

// ── Accessibility: ESC to close, focus kept inside the dialog ────────────────
const dialogEl = ref<HTMLElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    close('escape')
    return
  }
  if (e.key !== 'Tab') return

  const focusables = dialogEl.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  if (!focusables?.length) return
  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  schedule()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  if (timer) clearTimeout(timer)
  document.body.style.overflow = ''
})

// Config arrives after hydration on a cold load — (re)schedule once it lands.
watch(cfg, () => schedule())

// ── Submit ───────────────────────────────────────────────────────────────────
async function submitForm() {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    if (!(await verifyTurnstile())) {
      errorMessage.value = 'Verification failed. Please try again.'
      resetTurnstile()
      return
    }
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.public.web3FormsKeyLeads || config.public.web3FormsKey,
        form_id: 'popup_form',
        subject: 'New popup lead — Accident Professionals',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.details,
        // Which page the lead came from, by title (not URL) — as specified.
        page: document.title,
      }),
    })
    const result = await res.json()
    if (result.success) {
      successMessage.value = text.value.success
      gtmPush({ event: 'generate_lead', form_id: 'popup_form', page_title: document.title })
      Object.assign(form, { name: '', email: '', phone: '', details: '' })
      resetTurnstile()
      setTimeout(() => close('submitted'), 2500)
    } else {
      errorMessage.value = 'Something went wrong. Please call us directly.'
      resetTurnstile()
    }
  } catch {
    errorMessage.value = 'Unable to submit. Please call us directly.'
    resetTurnstile()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lp-fade">
      <div
        v-if="open"
        class="lp-backdrop"
        @click.self="close('backdrop')"
      >
        <div
          ref="dialogEl"
          class="lp-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lp-heading"
          aria-describedby="lp-subheading"
        >
          <button type="button" class="lp-close" aria-label="Close" @click="close('close-button')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <p v-if="text.eyebrow" class="lp-eyebrow"><span class="lp-dot" aria-hidden="true" />{{ text.eyebrow }}</p>

          <h2 id="lp-heading" class="lp-heading">
            {{ text.heading }}
            <span v-if="text.headingAccent" class="lp-accent">{{ text.headingAccent }}</span>
          </h2>

          <p id="lp-subheading" class="lp-sub">{{ text.subheading }}</p>

          <form class="lp-form" novalidate @submit.prevent="submitForm">
            <div class="lp-field">
              <label for="lp-name">Name <span aria-hidden="true">*</span></label>
              <input id="lp-name" v-model="form.name" type="text" placeholder="Full name" autocomplete="name" required />
            </div>

            <div class="lp-field">
              <label for="lp-phone">Phone number <span aria-hidden="true">*</span></label>
              <AppPhoneInput
                v-model:phone="form.phone"
                v-model:code="form.countryCode"
                variant="contact"
                input-id="lp-phone"
              />
            </div>

            <div class="lp-field">
              <label for="lp-email">Email address</label>
              <input id="lp-email" v-model="form.email" type="email" placeholder="email@email.com" autocomplete="email" />
            </div>

            <div class="lp-field">
              <label for="lp-details">Accident / injury details</label>
              <textarea id="lp-details" v-model="form.details" rows="3" placeholder="Briefly describe what happened…" />
            </div>

            <div id="leadpopup-turnstile" class="lp-turnstile" />

            <button type="submit" class="lp-submit" :disabled="!canSubmit">
              {{ submitting ? 'Sending…' : text.submitLabel }}
            </button>

            <p v-if="text.disclaimer" class="lp-disclaimer">{{ text.disclaimer }}</p>

            <p v-if="successMessage" class="lp-success" role="status">{{ successMessage }}</p>
            <p v-if="errorMessage" class="lp-error" role="alert">{{ errorMessage }}</p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(11, 11, 11, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  overflow-y: auto;
}

.lp-dialog {
  position: relative;
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 24px;
  padding: 32px 30px 26px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.lp-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-dark);
  cursor: pointer;
  transition: background var(--transition-base);
}
.lp-close:hover { background: rgba(0, 0, 0, 0.1); }

/* Matches the site-wide eyebrow treatment (small dot, not a button). */
.lp-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin: 0 0 10px;
}
.lp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.lp-heading {
  font-family: var(--font-secondary);
  font-size: clamp(1.5rem, 4vw, 1.85rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-dark);
  margin: 0 0 8px;
}
.lp-accent { color: var(--color-accent); }

.lp-sub {
  font-family: var(--font-primary);
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--color-muted);
  margin: 0 0 18px;
}

.lp-form { display: flex; flex-direction: column; gap: 12px; }

.lp-field { display: flex; flex-direction: column; gap: 6px; }
.lp-field label {
  font-family: var(--font-primary);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-dark);
}
.lp-field label span { color: var(--color-accent); }

.lp-field input,
.lp-field textarea {
  width: 100%;
  padding: 11px 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 15px;
  color: var(--color-dark);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.lp-field input::placeholder,
.lp-field textarea::placeholder { color: #9a9a9a; }
.lp-field input:focus,
.lp-field textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(243, 175, 0, 0.18);
}
.lp-field textarea { resize: none; line-height: 1.5; }

.lp-turnstile { min-height: 0; }

.lp-submit {
  width: 100%;
  padding: 14px 24px;
  margin-top: 2px;
  background: var(--color-accent);
  color: var(--color-dark);
  font-family: var(--font-primary);
  font-size: 15.5px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.lp-submit:hover:not(:disabled) { transform: translateY(-2px); }
.lp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

.lp-disclaimer {
  font-family: var(--font-primary);
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-muted);
  text-align: center;
  margin: 2px 0 0;
}

.lp-success { font-size: 14px; color: #15803d; text-align: center; font-weight: 500; margin: 4px 0 0; }
.lp-error { font-size: 14px; color: #dc2626; text-align: center; margin: 4px 0 0; }

/* Phones: dock to the bottom so the popup covers less of the page. */
@media (max-width: 575px) {
  .lp-backdrop { align-items: flex-end; padding: 0; }
  .lp-dialog {
    max-width: 100%;
    border-radius: 22px 22px 0 0;
    padding: 26px 20px 22px;
    max-height: 92vh;
  }
}

.lp-fade-enter-active,
.lp-fade-leave-active { transition: opacity 0.22s ease; }
.lp-fade-enter-from,
.lp-fade-leave-to { opacity: 0; }
.lp-fade-enter-active .lp-dialog { transition: transform 0.26s cubic-bezier(0.2, 0.8, 0.3, 1); }
.lp-fade-enter-from .lp-dialog { transform: translateY(14px) scale(0.98); }

@media (prefers-reduced-motion: reduce) {
  .lp-fade-enter-active,
  .lp-fade-leave-active,
  .lp-fade-enter-active .lp-dialog { transition: none; }
  .lp-fade-enter-from .lp-dialog { transform: none; }
}
</style>
