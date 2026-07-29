<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { countries } from '../../data/countries'
import { useDataLayer } from '../../composables/useDataLayer'
import { useTurnstile } from '../../composables/useTurnstile'

interface ContactForm {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  submitLabel?: string | null
  formSubject?: string | null
  reachHeading?: string | null
  email?: string | null
  address?: string | null
  callHeading?: string | null
  phoneLabel?: string | null
  phone?: string | null
  phoneNote?: string | null
  mapImage?: { url?: string } | null
  mapEmbedUrl?: string | null
}

const props = defineProps<{ block: ContactForm | null | undefined }>()

const config = useRuntimeConfig()
const route = useRoute()
const { push: gtmPush } = useDataLayer()
const { token: turnstileToken, reset: resetTurnstile, verify: verifyTurnstile } = useTurnstile('contactus-turnstile')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: 'US',
  message: '',
  agreed: false,
})

const dialCode = computed(() => countries.find((c) => c.code === form.countryCode)?.dial ?? '+1')
const mapImg = computed(() => strapiMedia(props.block?.mapImage))

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const canSubmit = computed(
  () =>
    !!form.firstName.trim() &&
    form.agreed &&
    !submitting.value &&
    !!turnstileToken.value,
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
        form_id: 'contact_form',
        subject: props.block?.formSubject || 'New consultation request — Contact Page',
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: `${dialCode.value} ${form.phone}`,
        message: form.message,
        page: document.title,
      }),
    })
    const result = await res.json()
    if (result.success) {
      successMessage.value = "Thank you! We'll be in touch shortly."
      gtmPush({ form_id: 'contact_form', page: route.path })
      Object.assign(form, { firstName: '', lastName: '', email: '', phone: '', message: '', agreed: false })
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
  <section v-if="block" id="contact-form" class="section scroll-mt-24 bg-white">
    <div class="site-container">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 3xl:gap-16">
        <!-- ── Left: form ── -->
        <div>
          <h2 class="mt-5 font-secondary text-3xl font-bold leading-tight text-dark sm:text-4xl 3xl:text-5xl">
            {{ block.heading }}
          </h2>
          <p v-if="block.intro" class="mt-4 max-w-xl font-primary text-base leading-relaxed text-muted">
            {{ block.intro }}
          </p>

          <form class="contact-form mt-8" novalidate @submit.prevent="submitForm">
            <div class="contact-form__row">
              <div class="contact-form__field">
                <label for="cf-first">First name <span>*</span></label>
                <input id="cf-first" v-model="form.firstName" type="text" placeholder="First name" autocomplete="given-name" required />
              </div>
              <div class="contact-form__field">
                <label for="cf-last">Last name <span>*</span></label>
                <input id="cf-last" v-model="form.lastName" type="text" placeholder="Last name" autocomplete="family-name" />
              </div>
            </div>

            <div class="contact-form__field">
              <label for="cf-email">Email <span class="contact-form__optional">(optional)</span></label>
              <input id="cf-email" v-model="form.email" type="email" placeholder="you@company.com" autocomplete="email" />
            </div>

            <div class="contact-form__field">
              <label for="cf-phone">Phone number <span>*</span></label>
              <AppPhoneInput v-model:phone="form.phone" v-model:code="form.countryCode" variant="contact" input-id="cf-phone" />
            </div>

            <div class="contact-form__field">
              <label for="cf-message">Message <span>*</span></label>
              <textarea id="cf-message" v-model="form.message" placeholder="Leave us a message…" rows="4" />
            </div>

            <div id="contactus-turnstile" />

            <AppCheckbox v-model="form.agreed">
              You agree to our friendly
              <NuxtLink to="/privacy-policy">privacy policy</NuxtLink>.
            </AppCheckbox>

            <button type="submit" class="contact-form__submit" :disabled="!canSubmit">
              {{ submitting ? 'Sending…' : (block.submitLabel || 'Submit Consultation Request') }}
              <svg v-if="!submitting" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <p v-if="successMessage" class="contact-form__success" role="status">{{ successMessage }}</p>
            <p v-if="errorMessage" class="contact-form__error" role="alert">{{ errorMessage }}</p>
          </form>
        </div>

        <!-- ── Right: info card + map ── -->
        <div class="flex flex-col gap-6">
          <div class="rounded-3xl bg-[#F7F1E1] p-8 3xl:p-10">
            <p v-if="block.reachHeading" class="font-secondary text-lg font-bold text-dark">{{ block.reachHeading }}</p>

            <ul class="mt-6 space-y-5">
              <li v-if="block.email" class="flex items-start gap-4">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                </span>
                <span>
                  <span class="block font-primary text-sm font-semibold text-dark">Email</span>
                  <a :href="`mailto:${block.email}`" class="font-primary text-base font-semibold text-accent">{{ block.email }}</a>
                </span>
              </li>

              <li v-if="block.address" class="flex items-start gap-4">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <span class="whitespace-pre-line font-primary text-base leading-relaxed text-dark">{{ block.address }}</span>
              </li>
            </ul>

            <p v-if="block.callHeading" class="mt-8 font-secondary text-lg font-bold text-dark">{{ block.callHeading }}</p>

            <div v-if="block.phone" class="mt-5 flex items-start gap-4">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
              </span>
              <span>
                <span class="block font-primary text-sm font-semibold text-dark">{{ block.phoneLabel || 'Phone Number' }}</span>
                <a :href="`tel:${block.phone.replace(/[^+\d]/g, '')}`" class="font-primary text-base font-semibold text-accent">{{ block.phone }}</a>
                <span v-if="block.phoneNote" class="mt-1 block font-primary text-sm text-muted">{{ block.phoneNote }}</span>
              </span>
            </div>
          </div>

          <!-- Map -->
          <iframe
            v-if="block.mapEmbedUrl"
            :src="block.mapEmbedUrl"
            title="Office location map"
            class="h-64 w-full rounded-3xl border-0 md:h-72 lg:h-full lg:min-h-[260px]"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
          <div v-else-if="mapImg" class="overflow-hidden rounded-3xl">
            <img :src="mapImg" alt="Office location map" class="h-64 w-full object-cover md:h-72 lg:h-full" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact-form__row {
  display: flex;
  gap: 16px;
}
@media (max-width: 575px) {
  .contact-form__row { flex-direction: column; }
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}
.contact-form__field label {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-dark);
}
.contact-form__field label span { color: var(--color-accent); }
.contact-form__field label span.contact-form__optional { color: var(--color-muted); font-weight: 400; }
.contact-form__field input,
.contact-form__field textarea {
  width: 100%;
  padding: 12px 15px;
  background: #f6f6f5;
  border: 1px solid #eaeae8;
  border-radius: 10px;
  font-family: var(--font-primary);
  font-size: 15px;
  color: var(--color-dark);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.contact-form__field input::placeholder,
.contact-form__field textarea::placeholder { color: #9b9893; }
.contact-form__field input:focus,
.contact-form__field textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(248, 192, 28, 0.15);
}
.contact-form__field textarea { resize: vertical; line-height: 1.55; }

/* AppCheckbox text is white by default (used on dark hero) — darken it here. */
.contact-form :deep(.app-checkbox__text) { color: var(--color-dark); }
.contact-form :deep(.app-checkbox__text a) { color: var(--color-dark); }

.contact-form__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 15px 24px;
  margin-top: 4px;
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
.contact-form__submit:hover:not(:disabled) { transform: translateY(-2px); }
.contact-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }

.contact-form__success {
  font-size: 14px;
  color: #15803d;
  font-weight: 500;
}

.contact-form__error {
  font-size: 14px;
  color: #dc2626;
}
</style>
