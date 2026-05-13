<template>
  <div class="home">
    <div class="home__bg" aria-hidden="true" />

    <div class="home__inner">
      <div class="home__logo">
        <img
          src="/brand/footer-logo.png"
          alt="Accident Professionals"
          width="200"
          height="42"
        />
      </div>

      <div class="home__header">
        <h1 class="home__h1">
          Connecting Accident Victims With<br />
          <span class="text-accent">Vetted Georgia Attorneys</span>
        </h1>
        <p class="home__sub">
          No upfront fees. Available 24/7. English &amp; Spanish supported.
        </p>
      </div>

      <div class="home__grid">
        <NuxtLink
          v-for="service in services"
          :key="service.href"
          :to="service.href"
          class="home__card"
        >
          <span class="home__card-tag">Practice Area</span>
          <h2 class="home__card-title">{{ service.title }}</h2>
          <p class="home__card-desc">{{ service.desc }}</p>
          <span class="home__card-cta">
            Free Consultation
            <img
              src="/services-page/auto-accidents/arrow-black.svg"
              alt=""
              width="16"
              height="16"
            />
          </span>
        </NuxtLink>
      </div>

      <a :href="config.public.phoneHref" class="home__phone">
        {{ config.public.phone }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const services = [
  {
    href: "/auto-accidents",
    title: "Auto Accidents",
    desc: "Car, truck, motorcycle, and rideshare accidents. Get connected with an attorney before you say anything that could hurt your case.",
  },
  {
    href: "/premises-liability",
    title: "Premises Liability",
    desc: "Slip & fall, negligent security, dog bites, and other property hazards. Hold negligent property owners accountable.",
  },
  {
    href: "/workplace-accidents",
    title: "Workplace Accidents",
    desc: "Workers' compensation, third-party claims, construction injuries, and on-the-road accidents. Know your rights.",
  },
];

useSeoMeta({
  title: "Accident Professionals | Georgia Personal Injury Attorney Referrals",
  description:
    "Connecting accident victims with vetted personal injury attorneys in Georgia. Auto accidents, premises liability, workplace injuries. Free consultation. No upfront fees.",
  robots: "index, follow",
});
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 100px;
  margin-bottom: 100px;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url("/services-page/auto-accidents/black-bg.png");
    background-size: cover;
    background-position: center;
  }

  &__inner {
    position: relative;
    z-index: 1;
    @include container;
    padding-top: 80px;
    padding-bottom: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
    text-align: center;
  }

  &__logo img {
    height: 42px;
    width: auto;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__h1 {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 700;
    color: var(--color-cream);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  &__sub {
    font-size: 16px;
    color: var(--color-muted);
    letter-spacing: -0.01em;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 100%;

    @include tablet-down {
      grid-template-columns: 1fr;
      max-width: 480px;
    }
  }

  &__card {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    padding: 32px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: background 0.25s ease, border-color 0.25s ease,
      transform 0.25s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(248, 192, 28, 0.35);
      transform: translateY(-4px);
    }
  }

  &__card-tag {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-accent);
  }

  &__card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-cream);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  &__card-desc {
    font-size: 14px;
    color: var(--color-muted);
    line-height: 1.65;
    letter-spacing: -0.01em;
    flex: 1;
  }

  &__card-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 10px 20px;
    background: var(--color-accent);
    color: var(--color-dark);
    font-size: 14px;
    font-weight: 600;
    border-radius: var(--radius-pill);
    align-self: flex-start;

    img {
      filter: none;
    }
  }

  &__phone {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-accent);
    letter-spacing: -0.03em;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
