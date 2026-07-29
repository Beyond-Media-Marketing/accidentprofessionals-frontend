<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { countries } from '../../data/countries'
import { useDataLayer } from '../../composables/useDataLayer'
import { useTurnstile } from '../../composables/useTurnstile'

interface AttorneyForm {
  heading?: string | null
  headingAccent?: string | null
  note?: string | null
  practiceAreaOptions?: string[] | null
  cityOptions?: string[] | null
  languageOptions?: string[] | null
  nextStepsTitle?: string | null
  nextSteps?: string[] | null
  consentText?: string | null
  submitLabel?: string | null
}
interface InfoRow { label?: string | null; value?: string | null }
interface ClientForm {
  heading?: string | null
  headingAccent?: string | null
  note?: string | null
  infoRows?: InfoRow[] | null
  submitLabel?: string | null
}
interface Block {
  attorneyTabLabel?: string | null
  clientTabLabel?: string | null
  attorneyForm?: AttorneyForm | null
  clientForm?: ClientForm | null
}

const props = defineProps<{
  block: Block | null | undefined
  attorneyImage?: string | null
  clientImage?: string | null
}>()

const route = useRoute()
const config = useRuntimeConfig()
const { push: gtmPush } = useDataLayer()

/* ── Toggle + hash deep-linking (hero role cards / CTAs land here) ── */
const tab = ref<'attorney' | 'client'>('attorney')

function applyHash(h: string) {
  if (h.includes('client')) tab.value = 'client'
  else if (h.includes('attorney')) tab.value = 'attorney'
}
onMounted(() => {
  if (route.hash) applyHash(route.hash)
})
watch(
  () => route.hash,
  (h) => {
    if (!h || !h.startsWith('#apply')) return
    applyHash(h)
    if (!import.meta.client) return
    const el = document.getElementById('apply')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  },
)

/* ── Attorney application form ── */
const aForm = reactive({
  name: '', firm: '', email: '', phone: '', countryCode: 'US',
  bar: '', years: '', practiceArea: '', city: '', language: '', why: '', agreed: false,
})
const aDial = computed(() => countries.find((c) => c.code === aForm.countryCode)?.dial ?? '+1')
const aSubmitting = ref(false)
const aSuccess = ref('')
const aError = ref('')
const { token: aTurnstileToken, reset: aResetTurnstile, verify: aVerifyTurnstile } = useTurnstile('apply-attorney-turnstile')
const aCanSubmit = computed(() => !!aForm.name.trim() && !!aForm.email.trim() && !!aForm.bar.trim() && aForm.agreed && !aSubmitting.value && !!aTurnstileToken.value)

async function submitAttorney() {
  if (!aForm.agreed) { aError.value = 'Please agree to the communication standards to continue.'; return }
  aSubmitting.value = true; aError.value = ''; aSuccess.value = ''
  try {
    if (!(await aVerifyTurnstile())) {
      aError.value = 'Verification failed. Please try again.'; aResetTurnstile(); aSubmitting.value = false; return
    }
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.public.web3FormsKeyAttorneys || config.public.web3FormsKey,
        form_id: 'attorney_application',
        subject: 'New attorney application — AP Legal Network',
        name: aForm.name, firm: aForm.firm, email: aForm.email,
        phone: `${aDial.value} ${aForm.phone}`,
        georgia_bar_number: aForm.bar, years_practicing: aForm.years,
        practice_areas: aForm.practiceArea, cities_served: aForm.city,
        languages: aForm.language, why_join: aForm.why, page: document.title,
      }),
    })
    const result = await res.json()
    if (result.success) {
      aSuccess.value = "Thank you! Your application has been received — we'll be in touch within 2 business days."
      gtmPush({ form_id: 'attorney_application', service_page: route.path })
      Object.assign(aForm, { name: '', firm: '', email: '', phone: '', bar: '', years: '', practiceArea: '', city: '', language: '', why: '', agreed: false })
      aResetTurnstile()
    } else { aError.value = 'Something went wrong. Please try again or call us directly.'; aResetTurnstile() }
  } catch { aError.value = 'Unable to submit. Please try again or call us directly.'; aResetTurnstile() }
  finally { aSubmitting.value = false }
}

/* ── Client match form ── */
const cForm = reactive({ name: '', email: '', phone: '', countryCode: 'US', city: '', description: '' })
const cDial = computed(() => countries.find((c) => c.code === cForm.countryCode)?.dial ?? '+1')
const cSubmitting = ref(false)
const cSuccess = ref('')
const cError = ref('')
const { token: cTurnstileToken, reset: cResetTurnstile, verify: cVerifyTurnstile } = useTurnstile('apply-client-turnstile')
const cCanSubmit = computed(() => !!cForm.name.trim() && !!cForm.email.trim() && !cSubmitting.value && !!cTurnstileToken.value)

async function submitClient() {
  cSubmitting.value = true; cError.value = ''; cSuccess.value = ''
  try {
    if (!(await cVerifyTurnstile())) {
      cError.value = 'Verification failed. Please try again.'; cResetTurnstile(); cSubmitting.value = false; return
    }
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.public.web3FormsKeyLeads || config.public.web3FormsKey,
        form_id: 'client_match',
        subject: 'New client match request — AP Legal Network',
        name: cForm.name, email: cForm.email,
        phone: `${cDial.value} ${cForm.phone}`,
        georgia_city: cForm.city, accident_description: cForm.description, page: document.title,
      }),
    })
    const result = await res.json()
    if (result.success) {
      cSuccess.value = "Thank you! We'll match you with a Georgia attorney shortly."
      gtmPush({ form_id: 'client_match', service_page: route.path })
      Object.assign(cForm, { name: '', email: '', phone: '', city: '', description: '' })
      cResetTurnstile()
    } else { cError.value = 'Something went wrong. Please try again or call us directly.'; cResetTurnstile() }
  } catch { cError.value = 'Unable to submit. Please try again or call us directly.'; cResetTurnstile() }
  finally { cSubmitting.value = false }
}

const fieldClass = 'w-full rounded-lg border border-black/10 bg-white px-4 py-3 font-primary text-sm text-dark outline-none transition-colors placeholder:text-muted/70 focus:border-accent'
const labelClass = 'mb-1.5 block font-primary text-[13px] font-medium text-dark/80'
</script>

<template>
  <section v-if="block" id="apply" class="section scroll-mt-24 bg-white">
    <div class="site-container">
      <!-- Toggle -->
      <div class="mx-auto grid max-w-[840px] grid-cols-2 gap-2 rounded-pill bg-[#f3f2ef] p-1.5">
        <button
          type="button"
          class="rounded-pill py-3 font-primary text-sm font-semibold transition-colors"
          :class="tab === 'attorney' ? 'bg-accent text-white' : 'text-muted hover:text-dark'"
          @click="tab = 'attorney'"
        >{{ block.attorneyTabLabel }}</button>
        <button
          type="button"
          class="rounded-pill py-3 font-primary text-sm font-semibold transition-colors"
          :class="tab === 'client' ? 'bg-accent text-white' : 'text-muted hover:text-dark'"
          @click="tab = 'client'"
        >{{ block.clientTabLabel }}</button>
      </div>

      <!-- ============ ATTORNEY APPLICATION ============ -->
      <div v-if="tab === 'attorney'" class="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start 3xl:gap-14">
        <!-- Left: form -->
        <div>
          <h2 class="font-secondary text-[clamp(1.7rem,3vw,2.5rem)] font-bold leading-[1.12] text-dark">
            {{ block.attorneyForm?.heading }} <span class="text-accent">{{ block.attorneyForm?.headingAccent }}</span>
          </h2>
          <p v-if="block.attorneyForm?.note" class="mt-3 font-primary text-sm leading-relaxed text-muted">{{ block.attorneyForm.note }}</p>

          <form class="mt-7 flex flex-col gap-4" novalidate @submit.prevent="submitAttorney">
            <div class="grid gap-4 sm:grid-cols-2">
              <div><label :class="labelClass">Full name *</label><input v-model="aForm.name" :class="fieldClass" placeholder="Full name" required /></div>
              <div><label :class="labelClass">Firm name *</label><input v-model="aForm.firm" :class="fieldClass" placeholder="Firm name" /></div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div><label :class="labelClass">Email *</label><input v-model="aForm.email" type="email" :class="fieldClass" placeholder="you@company.com" required /></div>
              <div><label :class="labelClass">Phone number</label><AppPhoneInput v-model:phone="aForm.phone" v-model:code="aForm.countryCode" variant="contact" input-id="a-phone" /></div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div><label :class="labelClass">Georgia bar number *</label><input v-model="aForm.bar" :class="fieldClass" placeholder="012345" required /></div>
              <div><label :class="labelClass">Years Practicing</label><input v-model="aForm.years" type="number" min="0" :class="fieldClass" placeholder="e.g. 10" /></div>
            </div>
            <div>
              <label :class="labelClass">Practice Areas</label>
              <select v-model="aForm.practiceArea" class="ap-select" :class="fieldClass">
                <option value="" disabled>Select</option>
                <option v-for="o in block.attorneyForm?.practiceAreaOptions ?? []" :key="o" :value="o">{{ o }}</option>
              </select>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label :class="labelClass">Cities Served</label>
                <select v-model="aForm.city" class="ap-select" :class="fieldClass">
                  <option value="" disabled>Select</option>
                  <option v-for="o in block.attorneyForm?.cityOptions ?? []" :key="o" :value="o">{{ o }}</option>
                </select>
              </div>
              <div>
                <label :class="labelClass">Languages</label>
                <select v-model="aForm.language" class="ap-select" :class="fieldClass">
                  <option value="" disabled>Select</option>
                  <option v-for="o in block.attorneyForm?.languageOptions ?? []" :key="o" :value="o">{{ o }}</option>
                </select>
              </div>
            </div>
            <div>
              <label :class="labelClass">Why Join AP</label>
              <textarea v-model="aForm.why" rows="3" :class="fieldClass" placeholder="Tell us why you want to be part of the AP network…" />
            </div>

            <label class="flex items-start gap-2.5 font-primary text-[13px] leading-snug text-muted">
              <input v-model="aForm.agreed" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
              <span>{{ block.attorneyForm?.consentText }}</span>
            </label>

            <div id="apply-attorney-turnstile" />

            <button type="submit" class="mt-1 flex w-full items-center justify-center gap-2 rounded-pill bg-accent px-6 py-4 font-primary text-[15px] font-semibold text-dark shadow-button transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60" :disabled="!aCanSubmit">
              {{ aSubmitting ? 'Sending…' : block.attorneyForm?.submitLabel }}
              <img v-if="!aSubmitting" src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
            </button>
            <p v-if="aSuccess" class="text-center font-primary text-sm font-medium text-[#16a34a]">{{ aSuccess }}</p>
            <p v-if="aError" class="text-center font-primary text-sm text-red-500">{{ aError }}</p>
          </form>
        </div>

        <!-- Right: image + what happens next -->
        <div class="flex flex-col gap-6">
          <div class="overflow-hidden rounded-3xl">
            <img v-if="attorneyImage" :src="attorneyImage" alt="AP attorney network" class="block h-[380px] w-full origin-top scale-[1.03] object-cover lg:h-[560px]" loading="lazy" decoding="async" />
          </div>
          <div v-if="block.attorneyForm?.nextSteps?.length" class="rounded-3xl bg-dark p-7 text-on-dark 3xl:p-8">
            <h3 class="mb-5 font-secondary text-lg font-bold text-white">{{ block.attorneyForm.nextStepsTitle }}</h3>
            <ol class="flex flex-col gap-4">
              <li v-for="(step, i) in block.attorneyForm.nextSteps" :key="i" class="flex items-start gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-primary text-xs font-bold text-dark">{{ i + 1 }}</span>
                <span class="font-primary text-sm leading-snug text-white/75">{{ step }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- ============ CLIENT MATCH ============ -->
      <div v-else class="mt-10">
        <div class="text-center">
          <h2 class="font-secondary text-[clamp(1.7rem,3vw,2.5rem)] font-bold leading-[1.12] text-dark">
            {{ block.clientForm?.heading }} <span class="text-accent">{{ block.clientForm?.headingAccent }}</span>
          </h2>
          <p v-if="block.clientForm?.note" class="mt-3 font-primary text-sm text-muted">{{ block.clientForm.note }}</p>
        </div>

        <div class="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start 3xl:gap-14">
          <!-- Left: image + info rows -->
          <div class="flex flex-col gap-6">
            <div class="overflow-hidden rounded-3xl">
              <img v-if="clientImage" :src="clientImage" alt="Personal injury consultation" class="block h-[260px] w-full origin-top scale-[1.03] object-cover sm:h-[300px]" loading="lazy" decoding="async" />
            </div>
            <div v-if="block.clientForm?.infoRows?.length" class="flex flex-col gap-4">
              <div v-for="(row, i) in block.clientForm.infoRows" :key="i" class="flex items-center gap-3">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <p class="font-primary text-xs text-muted">{{ row.label }}</p>
                  <p class="font-primary text-base font-semibold text-dark">{{ row.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: form -->
          <div>
            <form class="flex flex-col gap-4" novalidate @submit.prevent="submitClient">
              <div><label :class="labelClass">Full name *</label><input v-model="cForm.name" :class="fieldClass" placeholder="Full name" required /></div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div><label :class="labelClass">Email *</label><input v-model="cForm.email" type="email" :class="fieldClass" placeholder="you@company.com" required /></div>
                <div><label :class="labelClass">Phone number</label><AppPhoneInput v-model:phone="cForm.phone" v-model:code="cForm.countryCode" variant="contact" input-id="c-phone" /></div>
              </div>
              <div><label :class="labelClass">Georgia city *</label><input v-model="cForm.city" :class="fieldClass" placeholder="e.g. Atlanta" required /></div>
              <div><label :class="labelClass">Accident Description</label><textarea v-model="cForm.description" rows="4" :class="fieldClass" placeholder="Briefly describe what happened…" /></div>

              <div id="apply-client-turnstile" />

              <button type="submit" class="mt-1 flex w-full items-center justify-center gap-2 rounded-pill bg-accent px-6 py-4 font-primary text-[15px] font-semibold text-dark shadow-button transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60" :disabled="!cCanSubmit">
                {{ cSubmitting ? 'Sending…' : block.clientForm?.submitLabel }}
                <img v-if="!cSubmitting" src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
              </button>
              <p v-if="cSuccess" class="text-center font-primary text-sm font-medium text-[#16a34a]">{{ cSuccess }}</p>
              <p v-if="cError" class="text-center font-primary text-sm text-red-500">{{ cError }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom dropdown chevron with room from the edge (native arrow sat too close). */
.ap-select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 2.75rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}
</style>
