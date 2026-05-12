<template>
  <section class="hero" aria-label="Hero">
    <!-- bg image already has all effects baked in -->
    <div class="hero__bg" aria-hidden="true" />

    <!-- Floating side CTA -->
    <div class="hero__side-cta" aria-hidden="true">
      <span class="hero__side-text">CALL US NOW</span>
      <a
        :href="config.public.phoneHref"
        class="hero__phone-btn"
        aria-label="Call us now"
      >
        <img
          src="/services-page/auto-accidents/phone-icon-circle.png"
          alt=""
          width="26"
          height="26"
        />
      </a>
    </div>

    <div class="hero__inner">
      <!-- ── LEFT: content ── -->
      <div class="hero__content">
        <AppBadge class="reveal">{{ data.badge }}</AppBadge>

        <h1 class="hero__h1 reveal reveal-delay-1">
          {{ data.h1Part1 }}<br />
          <span class="text-accent">{{ data.h1Accent }}</span>
        </h1>

        <p class="hero__subtitle reveal reveal-delay-1">
          {{ data.h1Subtitle }}
        </p>

        <p class="hero__body reveal reveal-delay-2">{{ data.heroBody }}</p>

        <div class="hero__stats reveal reveal-delay-3">
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
              <div class="hero__phone-input">
                <span class="hero__phone-prefix">🇺🇸 US +1</span>
                <input
                  id="hero-phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  autocomplete="tel"
                />
              </div>
            </div>
            <div class="hero__field">
              <label for="hero-case">Case type</label>
              <div class="hero__select-wrap">
                <select id="hero-case" v-model="form.accidentType">
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
              v-model="form.description"
              placeholder="Write details about your accident here…."
              rows="3"
            />
          </div>

          <!-- CTA button (full width) -->
          <button type="submit" class="hero__submit" :disabled="submitting">
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
import { heroData as defaultData } from "../../data/home";

const props = defineProps({ data: { default: () => defaultData } });
const data = props.data as typeof defaultData;
const config = useRuntimeConfig();
const route = useRoute();

const defaultCaseType =
  data.routeCaseTypeMap[route.path.replace(/\/$/, "")] ?? "";

const form = reactive({
  name: "",
  email: "",
  phone: "",
  accidentType: defaultCaseType,
  description: "",
  agreed: false,
});

const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function submitForm() {
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
        phone: form.phone,
        accident_type: form.accidentType,
        description: form.description,
      }),
    });
    const result = await res.json();
    if (result.success) {
      successMessage.value = "Thank you! We'll be in touch shortly.";
      Object.assign(form, {
        name: "",
        email: "",
        phone: "",
        accidentType: "",
        description: "",
        agreed: false,
      });
    } else {
      errorMessage.value = "Something went wrong. Please call us directly.";
    }
  } catch {
    errorMessage.value = "Unable to submit. Please call us directly.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100vh;
  padding-top: 90px; // navbar height
  overflow: hidden;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);

  @include mobile {
    min-height: auto;
  }

  // bg image already has all overlay effects
  &__bg {
    position: absolute;
    inset: 0;
    background-image: url("/services-page/auto-accidents/hero-bg.png");
    background-size: cover;
    background-position: center top;
  }

  // ── Floating side CTA ──────────────────────────────────────────────────────
  &__side-cta {
    position: absolute;
    right: 0;
    bottom: 120px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding-right: 7px;

    @include tablet-down {
      display: none;
    }
  }

  &__side-text {
    writing-mode: vertical-rl;
    transform: rotate(360deg);
    font-size: 18px;
    font-weight: 600;
    font-family: var(--font-primary);
    color: var(--color-accent);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  &__phone-btn {
    display: block;
    transition: transform var(--transition-base);
    &:hover {
      transform: scale(1.08);
    }
    img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      display: block;
    }
  }

  // ── Layout ─────────────────────────────────────────────────────────────────
  &__inner {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1440px;
    margin-inline: auto;
    padding: 40px 112px 60px;
    display: grid;
    grid-template-columns: 1fr 551px;
    gap: 50px;
    align-items: start;

    @include tablet-down {
      grid-template-columns: 1fr;
      padding: 32px 24px 48px;
      gap: 40px;
    }
  }

  // ── Left content ───────────────────────────────────────────────────────────
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 20px;

    @include tablet-down {
      padding-top: 0;
    }
  }

  &__h1 {
    font-size: clamp(2.5rem, 5vw, 4.375rem);
    font-weight: 700;
    color: var(--color-cream);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    font-weight: 700;
    color: var(--color-cream);
    letter-spacing: -0.01em;
    line-height: 1.4;
  }

  &__body {
    font-size: 16px;
    color: var(--color-muted);
    line-height: 1.65;
    letter-spacing: -0.02em;
    max-width: 520px;
  }

  &__stats {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 28px;
    border-top: 1px solid rgba(248, 246, 244, 0.2);
    margin-top: 8px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__stat-value {
    font-size: clamp(2rem, 3.5vw, 3.5rem);
    font-weight: 700;
    color: var(--color-cream);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  &__stat-label {
    font-size: 14px;
    color: var(--color-muted);
    letter-spacing: -0.01em;
  }

  // ── Form card ──────────────────────────────────────────────────────────────
  &__form-wrap {
    @include tablet-down {
      padding-top: 0;
    }
  }

  &__form {
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

  &__form-row {
    display: flex;
    gap: 10px;

    @include mobile {
      flex-direction: column;
    }
  }

  // ── Individual fields ──────────────────────────────────────────────────────
  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;

    label {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-white);
      letter-spacing: -0.01em;
    }

    input,
    textarea {
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

      &::placeholder {
        color: #767676;
      }
      &:focus {
        box-shadow: 0 0 0 2px var(--color-accent);
      }
    }

    textarea {
      resize: none;
      line-height: 1.5;
    }
  }

  // ── Phone with prefix ──────────────────────────────────────────────────────
  &__phone-input {
    display: flex;
    background: rgba(255, 255, 255, 0.88);
    border-radius: var(--radius-sm);
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

    &:focus-within {
      box-shadow: 0 0 0 2px var(--color-accent);
    }

    input {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding-left: 8px;

      &:focus {
        box-shadow: none;
      }
    }
  }

  &__phone-prefix {
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 12px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-dark);
    white-space: nowrap;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  // ── Select ─────────────────────────────────────────────────────────────────
  &__select-wrap {
    position: relative;

    select {
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

      &:focus {
        box-shadow: 0 0 0 2px var(--color-accent);
      }
    }
  }

  &__select-chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #525252;
    pointer-events: none;
  }

  // ── Submit button ──────────────────────────────────────────────────────────
  &__submit {
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

    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  // ── Divider ────────────────────────────────────────────────────────────────
  &__divider {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    margin: 2px 0;
  }

  // ── Urgency checks ─────────────────────────────────────────────────────────
  &__checks {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 16px;
  }

  &__check-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-muted);
    white-space: nowrap;

    img {
      flex-shrink: 0;
    }
  }

  // ── Social proof ───────────────────────────────────────────────────────────
  &__proof {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 4px;
  }

  &__avatars {
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-left: -10px;
      &:first-child {
        margin-left: 0;
      }
      object-fit: cover;
    }
  }

  &__proof-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__client-count {
    font-size: 17px;
    font-weight: 600;
    color: var(--color-cream);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  &__stars {
    display: flex;
    gap: 3px;
  }

  // ── Messages ───────────────────────────────────────────────────────────────
  &__success {
    font-size: 14px;
    color: #4ade80;
    text-align: center;
    font-weight: 500;
  }

  &__error {
    font-size: 14px;
    color: #f87171;
    text-align: center;
  }
}
</style>
