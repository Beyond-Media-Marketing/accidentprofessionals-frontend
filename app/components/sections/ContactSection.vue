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
            type="hidden"
            name="access_key"
            :value="config.public.web3FormsKey"
          />
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
                <option value="Car Accident">Car Accident</option>
                <option value="Truck Accident">Truck Accident</option>
                <option value="Motorcycle Accident">Motorcycle Accident</option>
                <option value="Rideshare Accident">Rideshare Accident</option>
                <option value="Other">Other</option>
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
          <div id="contact-hcaptcha" />

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
import { ctaBannerData as defaultData } from "../../data/auto-accidents";
import { countries } from "../../data/countries";
import { useDataLayer } from "../../composables/useDataLayer";
import { useHCaptcha } from "../../composables/useHCaptcha";

const props = defineProps({ data: { default: () => defaultData } });
const data = props.data as typeof defaultData;
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
const { push: gtmPush } = useDataLayer();
const { token: hcaptchaToken, reset: resetHCaptcha } = useHCaptcha("contact-hcaptcha");

const canSubmit = computed(() =>
  form.agreed && !loading.value &&
  !!hcaptchaToken.value
);

async function submit() {
  if (!form.agreed) return;
  loading.value = true;
  success.value = false;
  formError.value = false;

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: config.public.web3FormsKey,
        subject: data.formSubject,
        name: form.name,
        email: form.email,
        phone: `${dialCode.value} ${form.phone}`,
        case_type: form.caseType,
        message: form.message,
        service_page: route.path,
        ...(hcaptchaToken.value && { "h-captcha-response": hcaptchaToken.value }),
      }),
    });
    const json = await res.json();
    if (json.success) {
      success.value = true;
      gtmPush({
        form_id: "contact_form",
        case_type: form.caseType,
        service_page: route.path,
      });
      Object.assign(form, {
        name: "", email: "", phone: "", caseType: "", message: "", agreed: false,
      });
      resetHCaptcha();
    } else {
      formError.value = true;
      resetHCaptcha();
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
