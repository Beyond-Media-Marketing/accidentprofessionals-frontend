<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { countries } from '../../data/countries'
import { useDataLayer } from '../../composables/useDataLayer'
import { useTurnstile } from '../../composables/useTurnstile'

interface CaseOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    caseOptions?: CaseOption[]
    formSubject?: string
    clientCount?: string
    ctaLabel?: string
  }>(),
  {
    formSubject: 'New consultation request — Accident Professionals',
    clientCount: '1,200+ Clients Helped',
    ctaLabel: 'Get Free Consultation',
  },
)

const caseOptions = computed<CaseOption[]>(
  () =>
    props.caseOptions ?? [
      { value: 'car', label: 'Car Accidents' },
      { value: 'truck', label: 'Truck Accidents' },
      { value: 'rideshare', label: 'Rideshare Accidents' },
      { value: 'slip-fall', label: 'Slip & Fall' },
      { value: 'workplace', label: 'Workplace Injuries' },
      { value: 'motorcycle', label: 'Motorcycle Accidents' },
      { value: 'other', label: 'Other / Not sure' },
    ],
)

const config = useRuntimeConfig()
const route = useRoute()
const { push: gtmPush } = useDataLayer()
const { token: turnstileToken, reset: resetTurnstile, verify: verifyTurnstile } = useTurnstile('leadform-turnstile')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  countryCode: 'US',
  caseType: '',
  message: '',
  agreed: false,
})

const dialCode = computed(() => countries.find((c) => c.code === form.countryCode)?.dial ?? '+1')
const caseLabel = (value: string) => caseOptions.value.find((o) => o.value === value)?.label ?? value

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const canSubmit = computed(
  () => !!form.name.trim() && !!form.email.trim() && form.agreed && !submitting.value && !!turnstileToken.value,
)

async function submitForm() {
  if (!form.agreed) {
    errorMessage.value = 'Please agree to the privacy policy to continue.'
    return
  }
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    if (!(await verifyTurnstile())) {
      errorMessage.value = 'Verification failed. Please try again.'
      resetTurnstile()
      submitting.value = false
      return
    }
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.public.web3FormsKeyLeads || config.public.web3FormsKey,
        form_id: 'lead_form',
        subject: props.formSubject,
        name: form.name,
        email: form.email,
        phone: `${dialCode.value} ${form.phone}`,
        case_type: caseLabel(form.caseType),
        message: form.message,
        page: document.title,
      }),
    })
    const result = await res.json()
    if (result.success) {
      successMessage.value = "Thank you! We'll be in touch shortly."
      gtmPush({ form_id: 'lead_form', case_type: caseLabel(form.caseType), service_page: route.path })
      Object.assign(form, { name: '', email: '', phone: '', caseType: '', message: '', agreed: false })
      resetTurnstile()
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
  <form class="lead-form" novalidate @submit.prevent="submitForm">
    <div class="lead-form__row">
      <div class="lead-form__field">
        <label for="lf-name">Name</label>
        <input id="lf-name" v-model="form.name" type="text" placeholder="Full Name" autocomplete="name" required />
      </div>
      <div class="lead-form__field">
        <label for="lf-email">Email</label>
        <input id="lf-email" v-model="form.email" type="email" placeholder="email@email.com" autocomplete="email" required />
      </div>
    </div>

    <div class="lead-form__row">
      <div class="lead-form__field">
        <label for="lf-phone">Phone number</label>
        <AppPhoneInput v-model:phone="form.phone" v-model:code="form.countryCode" variant="hero" input-id="lf-phone" />
      </div>
      <div class="lead-form__field">
        <label for="lf-case">Case type</label>
        <div class="lead-form__select-wrap">
          <select id="lf-case" v-model="form.caseType">
            <option value="" disabled selected>Select</option>
            <option v-for="opt in caseOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <svg class="lead-form__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>

    <div class="lead-form__field">
      <label for="lf-desc">Description</label>
      <textarea id="lf-desc" v-model="form.message" placeholder="Write details about your accident here…." rows="3" />
    </div>

    <div id="leadform-turnstile" />

    <button type="submit" class="lead-form__submit" :disabled="!canSubmit">
      {{ submitting ? 'Sending…' : ctaLabel }}
      <img v-if="!submitting" src="/icons/arrow-next.svg" alt="" width="18" height="18" />
    </button>

    <AppCheckbox v-model="form.agreed">
      You agree to our friendly
      <NuxtLink to="/privacy-policy">privacy policy</NuxtLink>.
    </AppCheckbox>

    <div class="lead-form__divider" aria-hidden="true" />

    <div class="lead-form__proof">
      <div class="lead-form__avatars">
        <img src="/services-page/auto-accidents/circle1.png" alt="" width="40" height="40" />
        <img src="/services-page/auto-accidents/circle2.png" alt="" width="40" height="40" />
        <img src="/services-page/auto-accidents/circle3.png" alt="" width="40" height="40" />
        <img src="/services-page/auto-accidents/circle4.png" alt="" width="40" height="40" />
      </div>
      <div class="lead-form__proof-text">
        <p class="lead-form__client-count">{{ clientCount }}</p>
        <div class="lead-form__stars" aria-label="5 stars" role="img">
          <img v-for="n in 5" :key="n" src="/services-page/auto-accidents/star.svg" alt="" width="14" height="14" />
        </div>
      </div>
    </div>

    <p v-if="successMessage" class="lead-form__success" role="status">{{ successMessage }}</p>
    <p v-if="errorMessage" class="lead-form__error" role="alert">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
/* Exact design ported from the legacy services-page hero form (dark glass card). */
.lead-form {
  background: rgba(103, 103, 103, 0.15);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid #929190;
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lead-form__row {
  display: flex;
  gap: 10px;
}
@media (max-width: 575px) {
  .lead-form__row { flex-direction: column; }
}

.lead-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.lead-form__field label {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.01em;
}
.lead-form__field input,
.lead-form__field textarea {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.88);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 15px;
  color: var(--color-dark);
  outline: none;
  transition: box-shadow var(--transition-base);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.lead-form__field input::placeholder,
.lead-form__field textarea::placeholder { color: #767676; }
.lead-form__field input:focus,
.lead-form__field textarea:focus { box-shadow: 0 0 0 2px var(--color-accent); }
.lead-form__field textarea { resize: none; line-height: 1.5; }

.lead-form__select-wrap { position: relative; }
.lead-form__select-wrap select {
  width: 100%;
  padding: 10px 36px 10px 14px;
  background: rgba(255, 255, 255, 0.88);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 15px;
  color: var(--color-dark);
  outline: none;
  appearance: none;
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  transition: box-shadow var(--transition-base);
}
.lead-form__select-wrap select:focus { box-shadow: 0 0 0 2px var(--color-accent); }

.lead-form__chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #525252;
  pointer-events: none;
}

.lead-form__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 15px 24px;
  background: var(--color-accent);
  color: var(--color-dark);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  letter-spacing: -0.01em;
  box-shadow: var(--shadow-button);
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.lead-form__submit:hover:not(:disabled) { transform: translateY(-2px); }
.lead-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }

.lead-form__divider {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 2px 0;
}

.lead-form__proof {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 4px;
}

.lead-form__avatars {
  display: flex;
  align-items: center;
}
.lead-form__avatars img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: -10px;
  object-fit: cover;
}
.lead-form__avatars img:first-child { margin-left: 0; }

.lead-form__proof-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lead-form__client-count {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-cream);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.lead-form__stars {
  display: flex;
  gap: 3px;
}

.lead-form__success {
  font-size: 14px;
  color: var(--color-accent);
  text-align: center;
  font-weight: 500;
}

.lead-form__error {
  font-size: 14px;
  color: #f87171;
  text-align: center;
}
</style>
