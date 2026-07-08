<template>
  <section class="hero" :class="{ 'hero--flat': flat }" aria-label="Hero">
    <!-- bg image already has all effects baked in -->
    <div
      class="hero__bg"
      aria-hidden="true"
      :style="
        data.heroBg ? `background-image: url('${data.heroBg}')` : undefined
      "
    />

    <div class="hero__inner">
      <!-- ── LEFT: content ── -->
      <div class="hero__content">
        <AppBadge class="reveal">{{ data.badge }}</AppBadge>

        <h1 class="hero__h1 reveal reveal-delay-1">
          <template v-if="data.accentFirst">
            <span class="text-accent">{{ data.h1Accent }}</span><br />
            {{ data.h1Part1 }}
          </template>
          <template v-else>
            {{ data.h1Part1 }}<br />
            <span class="text-accent">{{ data.h1Accent }}</span>
          </template>
        </h1>

        <p class="hero__subtitle reveal reveal-delay-1">
          {{ data.h1Subtitle }}
        </p>

        <p class="hero__body reveal reveal-delay-2">{{ data.heroBody }}</p>

        <div v-if="data.stats?.length" class="hero__stats reveal reveal-delay-3">
          <div v-for="stat in data.stats" :key="stat.label" class="hero__stat">
            <span class="hero__stat-value">{{ stat.value }}</span>
            <span class="hero__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- ── RIGHT: form ── -->
      <div class="hero__form-wrap reveal reveal-delay-2">
        <form class="hero__form" @submit.prevent="submitForm" novalidate>
          <!-- Row 1: Name + Email -->
          <div class="hero__form-row">
            <div class="hero__field">
              <label for="hero-name">Name</label>
              <input
                id="hero-name"
                v-model="form.name"
                type="text"
                placeholder="Full Name"
                autocomplete="name"
                required
              />
            </div>
            <div class="hero__field">
              <label for="hero-email">Email</label>
              <input
                id="hero-email"
                v-model="form.email"
                type="email"
                placeholder="email@email.com"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <!-- Row 2: Phone + Case type -->
          <div class="hero__form-row">
            <div class="hero__field">
              <label for="hero-phone">Phone number</label>
              <AppPhoneInput
                v-model:phone="form.phone"
                v-model:code="form.countryCode"
                variant="hero"
                input-id="hero-phone"
              />
            </div>
            <div class="hero__field">
              <label for="hero-case">Case type</label>
              <div class="hero__select-wrap">
                <select id="hero-case" v-model="form.caseType">
                  <option value="" disabled selected>Select</option>
                  <option
                    v-for="opt in data.caseOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <svg
                  class="hero__select-chevron"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Row 3: Description -->
          <div class="hero__field">
            <label for="hero-desc">Description</label>
            <textarea
              id="hero-desc"
              v-model="form.message"
              placeholder="Write details about your accident here…."
              rows="3"
            />
          </div>

          <!-- hCaptcha widget — only renders when HCAPTCHA_SITE_KEY is set -->
          <div id="hero-hcaptcha" />

          <button type="submit" class="hero__submit" :disabled="!canSubmit">
            {{ submitting ? "Sending…" : "Get Free Consultation" }}
            <img
              src="/services-page/auto-accidents/arrow-black.svg"
              alt=""
              width="18"
              height="18"
            />
          </button>

          <!-- Privacy checkbox -->
          <AppCheckbox v-model="form.agreed">
            You agree to our friendly
            <NuxtLink to="/privacy-policy">privacy policy</NuxtLink>.
          </AppCheckbox>

          <!-- Separator -->
          <div class="hero__divider" aria-hidden="true" />

          <!-- Urgency check items -->
          <div class="hero__checks">
            <div
              v-for="bullet in data.urgencyBullets"
              :key="bullet"
              class="hero__check-item"
            >
              <img
                src="/services-page/auto-accidents/check-yellow-circle.png"
                alt=""
                width="20"
                height="20"
              />
              <span>{{ bullet }}</span>
            </div>
          </div>

          <!-- Social proof -->
          <div class="hero__proof">
            <div class="hero__avatars">
              <img
                src="/services-page/auto-accidents/circle1.png"
                alt=""
                width="40"
                height="40"
              />
              <img
                src="/services-page/auto-accidents/circle2.png"
                alt=""
                width="40"
                height="40"
              />
              <img
                src="/services-page/auto-accidents/circle3.png"
                alt=""
                width="40"
                height="40"
              />
              <img
                src="/services-page/auto-accidents/circle4.png"
                alt=""
                width="40"
                height="40"
              />
            </div>
            <div class="hero__proof-text">
              <p class="hero__client-count">{{ data.clientCount }}</p>
              <div class="hero__stars" aria-label="5 stars" role="img">
                <img
                  v-for="n in 5"
                  :key="n"
                  src="/services-page/auto-accidents/star.svg"
                  alt=""
                  width="14"
                  height="14"
                />
              </div>
            </div>
          </div>

          <p v-if="successMessage" class="hero__success" role="status">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="hero__error" role="alert">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { countries } from "../../data/countries";
import { useDataLayer } from "../../composables/useDataLayer";
import { useHCaptcha } from "../../composables/useHCaptcha";

const props = defineProps({
  data: { type: Object, required: true },
  /** Remove the rounded bottom corners (e.g. state pages). */
  flat: { type: Boolean, default: false },
});
const data = props.data as any;
const config = useRuntimeConfig();
const route = useRoute();

const defaultCaseType =
  data.routeCaseTypeMap[route.path.replace(/\/$/, "")] ?? "";

const form = reactive({
  name: "",
  email: "",
  phone: "",
  countryCode: "US",
  caseType: defaultCaseType,
  message: "",
  agreed: false,
});

const dialCode = computed(
  () => countries.find((c) => c.code === form.countryCode)?.dial ?? "+1"
);
const { push: gtmPush } = useDataLayer();
const { token: hcaptchaToken, reset: resetHCaptcha } = useHCaptcha("hero-hcaptcha");
const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const canSubmit = computed(() =>
  !!form.name.trim() &&
  !!form.email.trim() &&
  form.agreed &&
  !submitting.value &&
  !!hcaptchaToken.value
);

async function submitForm() {
  if (!form.agreed) {
    errorMessage.value = "Please agree to the privacy policy to continue.";
    return;
  }
  if (!form.name || !form.email) {
    errorMessage.value = "Please fill in your name and email.";
    return;
  }
  submitting.value = true;
  errorMessage.value = "";
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: config.public.web3FormsKey,
        subject: data.formSubject,
        name: form.name,
        email: form.email,
        phone: `${dialCode.value} ${form.phone}`,
        case_type: data.caseOptions.find(o => o.value === form.caseType)?.label ?? form.caseType,
        message: form.message,
        service_page: route.path,
        ...(hcaptchaToken.value && { "h-captcha-response": hcaptchaToken.value }),
      }),
    });
    const result = await res.json();
    if (result.success) {
      successMessage.value = "Thank you! We'll be in touch shortly.";
      gtmPush({
        form_id: "hero_form",
        case_type: data.caseOptions.find(o => o.value === form.caseType)?.label ?? form.caseType,
        service_page: route.path,
      });
      Object.assign(form, {
        name: "", email: "", phone: "", caseType: "", message: "", agreed: false,
      });
      resetHCaptcha();
    } else {
      errorMessage.value = "Something went wrong. Please call us directly.";
      resetHCaptcha();
    }
  } catch {
    errorMessage.value = "Unable to submit. Please call us directly.";
    resetHCaptcha();
  } finally {
    submitting.value = false;
  }
}
</script>

<!-- Plain CSS (no SCSS): the glass form card, fields, select, pulse-ring submit,
     social proof. Layout mirrors .site-container. `pulse-ring` keyframe is global. -->
<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  padding-top: 90px;
  overflow: hidden;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
.hero--flat {
  border-radius: 0;
}
@media (max-width: 767px) {
  .hero { min-height: auto; }
}

.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
}

.hero__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1.5rem;
  padding-top: 40px;
  padding-bottom: 60px;
  display: grid;
  grid-template-columns: 1fr 551px;
  gap: 50px;
  align-items: center;
}
@media (min-width: 640px) { .hero__inner { padding-inline: 2rem; } }
@media (min-width: 1024px) { .hero__inner { padding-inline: 2.5rem; } }
@media (min-width: 1536px) { .hero__inner { max-width: 1440px; padding-inline: 3rem; } }
@media (min-width: 1920px) { .hero__inner { max-width: 1700px; padding-inline: 4rem; } }
@media (min-width: 2560px) { .hero__inner { max-width: 2100px; padding-inline: 5rem; } }
@media (max-width: 1199px) {
  .hero__inner {
    grid-template-columns: 1fr;
    padding-top: 32px;
    padding-bottom: 48px;
    gap: 40px;
  }
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
}
@media (max-width: 1199px) { .hero__content { padding-top: 0; } }

.hero__h1 {
  font-size: clamp(2.5rem, 5vw, 4.375rem);
  font-weight: 700;
  color: var(--color-cream);
  line-height: 1;
  letter-spacing: -0.02em;
}
.hero__subtitle {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  font-weight: 700;
  color: var(--color-cream);
  letter-spacing: -0.01em;
  line-height: 1.4;
}
.hero__body {
  font-size: 16px;
  color: var(--color-muted);
  line-height: 1.65;
  letter-spacing: -0.02em;
  max-width: 520px;
}
.hero__stats {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 28px;
  border-top: 1px solid rgba(248, 246, 244, 0.2);
  margin-top: 8px;
}
.hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.hero__stat-value {
  font-size: clamp(2rem, 3.5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-cream);
  line-height: 1;
  letter-spacing: -0.03em;
}
.hero__stat-label {
  font-size: 14px;
  color: var(--color-muted);
  letter-spacing: -0.01em;
}

@media (max-width: 1199px) { .hero__form-wrap { padding-top: 0; } }

.hero__form {
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
.hero__form-row {
  display: flex;
  gap: 10px;
}
@media (max-width: 767px) { .hero__form-row { flex-direction: column; } }

.hero__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.hero__field label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-white);
  letter-spacing: -0.01em;
}
.hero__field input,
.hero__field textarea {
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
.hero__field input::placeholder,
.hero__field textarea::placeholder { color: #767676; }
.hero__field input:focus,
.hero__field textarea:focus { box-shadow: 0 0 0 2px var(--color-accent); }
.hero__field textarea { resize: none; line-height: 1.5; }

.hero__select-wrap { position: relative; }
.hero__select-wrap select {
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
.hero__select-wrap select:focus { box-shadow: 0 0 0 2px var(--color-accent); }
.hero__select-chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #525252;
  pointer-events: none;
}

.hero__submit {
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
  position: relative;
  overflow: visible;
}
.hero__submit::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  border: 2px solid var(--color-accent);
  opacity: 0;
  animation: pulse-ring 2.5s ease-out infinite;
  pointer-events: none;
}
.hero__submit:hover:not(:disabled) { transform: translateY(-2px); }
.hero__submit:hover:not(:disabled)::after { animation: none; }
.hero__submit:disabled { opacity: 0.6; cursor: not-allowed; }
.hero__submit:disabled::after { animation: none; }

.hero__divider {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 2px 0;
}

.hero__checks {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.hero__check-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-muted);
  white-space: nowrap;
}
.hero__check-item img { flex-shrink: 0; }

.hero__proof {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 4px;
}
.hero__avatars {
  display: flex;
  align-items: center;
}
.hero__avatars img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: -10px;
  object-fit: cover;
}
.hero__avatars img:first-child { margin-left: 0; }
.hero__proof-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero__client-count {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-cream);
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.hero__stars {
  display: flex;
  gap: 3px;
}

.hero__success {
  font-size: 14px;
  color: var(--color-accent);
  text-align: center;
  font-weight: 500;
}
.hero__error {
  font-size: 14px;
  color: #f87171;
  text-align: center;
}
</style>
