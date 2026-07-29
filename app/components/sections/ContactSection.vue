<template>
  <section id="contact-section" class="contact" ref="sectionRef" aria-labelledby="contact-heading">
    <div class="contact__inner">
      <!-- Left: Form -->
      <div class="contact__left reveal">
        <h2 id="contact-heading" class="contact__heading">
          {{ data.headingMain }}
          <span class="text-accent">{{ data.headingAccent }}</span>
        </h2>
        <p class="contact__sub">{{ data.subheading }}</p>

        <form class="contact__form" @submit.prevent="submit" novalidate>
          <input
            type="checkbox"
            name="botcheck"
            style="display: none"
            tabindex="-1"
          />

          <div class="contact__field">
            <label for="cf-name" class="contact__label"
              >Full name <span class="contact__req">*</span></label
            >
            <input
              id="cf-name"
              v-model="form.name"
              type="text"
              name="name"
              class="contact__input"
              placeholder="Full name"
              required
            />
          </div>

          <div class="contact__field">
            <label for="cf-email" class="contact__label"
              >Email <span class="contact__req">*</span></label
            >
            <input
              id="cf-email"
              v-model="form.email"
              type="email"
              name="email"
              class="contact__input"
              placeholder="you@company.com"
              required
            />
          </div>

          <div class="contact__field">
            <label for="cf-phone" class="contact__label">Phone number</label>
            <AppPhoneInput
              v-model:phone="form.phone"
              v-model:code="form.countryCode"
              variant="contact"
              input-id="cf-phone"
            />
          </div>

          <div class="contact__field">
            <label for="cf-case" class="contact__label">Case type</label>
            <div class="contact__select-wrap">
              <select
                id="cf-case"
                v-model="form.caseType"
                name="case_type"
                class="contact__input contact__input--select"
              >
                <option value="" disabled>Select</option>
                <option
                  v-for="opt in data.caseOptions"
                  :key="opt.value"
                  :value="opt.value"
                >{{ opt.label }}</option>
              </select>
              <span class="contact__chevron" aria-hidden="true">
                <svg
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
              </span>
            </div>
          </div>

          <div class="contact__field">
            <label for="cf-desc" class="contact__label">Description</label>
            <textarea
              id="cf-desc"
              v-model="form.message"
              name="message"
              class="contact__input contact__input--textarea"
              placeholder="Write details about your accident here...."
            />
          </div>

          <label class="contact__privacy">
            <input
              type="checkbox"
              v-model="form.agreed"
              required
              class="contact__checkbox"
            />
            <span
              >You agree to our friendly
              <a href="/privacy-policy" class="contact__privacy-link"
                >privacy policy</a
              >.</span
            >
          </label>

          <!-- Turnstile widget -->
          <div id="contact-turnstile" />

          <AppButton
            tag="button"
            type="submit"
            class="contact__submit"
            :disabled="!canSubmit"
          >
            {{ loading ? "Sending…" : data.cta }}
            <img
              v-if="!loading"
              src="/services-page/auto-accidents/arrow-black.svg"
              alt=""
              width="18"
              height="18"
            />
          </AppButton>

          <p v-if="success" class="contact__success" role="status">
            Thank you! We'll be in touch shortly.
          </p>
          <p v-if="formError" class="contact__error" role="alert">
            Something went wrong. Please try again.
          </p>
        </form>

        <p class="contact__trust">
          Available 24/7 · No upfront fees · Multilingual support
        </p>
      </div>

      <!-- Right: Image -->
      <div class="contact__right reveal reveal-delay-2">
        <img
          src="/services-page/auto-accidents/image-end.webp"
          alt="Attorney consultation"
          class="contact__image"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { countries } from "../../data/countries";
import { useDataLayer } from "../../composables/useDataLayer";
import { useTurnstile } from "../../composables/useTurnstile";

const props = defineProps({ data: { type: Object, required: true } });
const data = props.data as any;
const config = useRuntimeConfig();
const route = useRoute();
const sectionRef = ref<HTMLElement | null>(null);

const loading = ref(false);
const success = ref(false);
const formError = ref(false);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  countryCode: "US",
  caseType: "",
  message: "",
  agreed: false,
});

const dialCode = computed(
  () => countries.find((c) => c.code === form.countryCode)?.dial ?? "+1"
);
const caseOptions = computed<{ value: string; label: string }[]>(
  () => (data as any).caseOptions ?? []
);
const caseLabel = (value: string) =>
  caseOptions.value.find((o) => o.value === value)?.label ?? value;
const { push: gtmPush } = useDataLayer();
const { token: turnstileToken, reset: resetTurnstile, verify: verifyTurnstile } = useTurnstile("contact-turnstile");

const canSubmit = computed(() =>
  !!form.name.trim() &&
  !!form.email.trim() &&
  form.agreed &&
  !loading.value &&
  !!turnstileToken.value
);

async function submit() {
  if (!form.agreed) return;
  loading.value = true;
  success.value = false;
  formError.value = false;

  try {
    if (!(await verifyTurnstile())) {
      formError.value = true;
      resetTurnstile();
      loading.value = false;
      return;
    }
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: config.public.web3FormsKeyLeads || config.public.web3FormsKey,
        form_id: "contact_form",
        subject: data.formSubject,
        name: form.name,
        email: form.email,
        phone: `${dialCode.value} ${form.phone}`,
        case_type: caseLabel(form.caseType),
        message: form.message,
        page: document.title,
      }),
    });
    const json = await res.json();
    if (json.success) {
      success.value = true;
      gtmPush({
        form_id: "contact_form",
        case_type: data.caseOptions.find(o => o.value === form.caseType)?.label ?? form.caseType,
        service_page: route.path,
      });
      Object.assign(form, {
        name: "", email: "", phone: "", caseType: "", message: "", agreed: false,
      });
      resetTurnstile();
    } else {
      formError.value = true;
      resetTurnstile();
    }
  } catch {
    formError.value = true;
    resetHCaptcha();
  } finally {
    loading.value = false;
  }
}

const sectionVisible = ref(false);

onMounted(() => {
  if (!sectionRef.value) return;
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        sectionVisible.value = true;
        obs.disconnect();
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  obs.observe(sectionRef.value);
});
</script>

<!-- Plain CSS (formerly the global _contact.scss). Container mirrors
     .site-container; dead .contact__phone-* rules dropped (uses AppPhoneInput). -->
<style scoped>
.contact { background: var(--color-white); }
.contact__inner {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1.5rem;
  padding-block: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
@media (min-width: 640px) { .contact__inner { padding-inline: 2rem; } }
@media (min-width: 1024px) { .contact__inner { padding-inline: 2.5rem; } }
@media (min-width: 1536px) { .contact__inner { max-width: 1440px; padding-inline: 3rem; } }
@media (min-width: 1920px) { .contact__inner { max-width: 1700px; padding-inline: 4rem; } }
@media (min-width: 2560px) { .contact__inner { max-width: 2100px; padding-inline: 5rem; } }
@media (max-width: 1199px) { .contact__inner { padding-block: 60px; } }
@media (min-width: 768px) and (max-width: 1199px) { .contact__inner { gap: 40px; } }
@media (max-width: 767px) { .contact__inner { grid-template-columns: 1fr; gap: 40px; padding-block: 48px; } }

.contact__left { display: flex; flex-direction: column; gap: 24px; }
.contact__heading {
  font-size: clamp(1.8rem, 3.5vw, 2.75rem);
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.2;
  letter-spacing: -0.03em;
}
.contact__sub {
  font-size: 15px;
  color: var(--color-muted);
  line-height: 1.6;
  margin-top: -12px;
}
.contact__form { display: flex; flex-direction: column; gap: 16px; }
.contact__field { display: flex; flex-direction: column; gap: 6px; }
.contact__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-dark);
  letter-spacing: -0.01em;
}
.contact__req { color: #e03e3e; }
.contact__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e0dd;
  border-radius: 8px;
  font-size: 15px;
  font-family: var(--font-secondary);
  color: var(--color-dark);
  background: var(--color-white);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.contact__input::placeholder { color: #b0aca8; }
.contact__input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(248, 192, 28, 0.15); }
.contact__input--textarea { resize: vertical; min-height: 100px; }
.contact__input--select { appearance: none; cursor: pointer; }
.contact__select-wrap { position: relative; }
.contact__chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
  display: flex;
}
.contact__privacy {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.5;
  cursor: pointer;
}
.contact__checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  accent-color: var(--color-accent);
  cursor: pointer;
}
.contact__privacy-link {
  color: var(--color-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.contact__privacy-link:hover { color: var(--color-accent); }
.contact__submit { width: 100%; margin-top: 4px; }
.contact__success {
  font-size: 14px;
  color: var(--color-accent);
  font-weight: 500;
  text-align: center;
}
.contact__error {
  font-size: 14px;
  color: #c0392b;
  font-weight: 500;
  text-align: center;
}
.contact__trust {
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  letter-spacing: 0.01em;
}
.contact__right { height: 100%; min-height: 500px; }
@media (max-width: 767px) { .contact__right { min-height: 280px; order: -1; } }
.contact__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--radius-xl);
  display: block;
}
</style>
