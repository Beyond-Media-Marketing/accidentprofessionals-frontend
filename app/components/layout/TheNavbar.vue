<template>
  <header class="navbar">
    <div class="navbar__inner">
      <a
        href="https://accidentprofessionals.com"
        target="_blank"
        rel="noopener"
        class="navbar__logo"
        aria-label="Accident Professionals — Home"
      >
        <img
          src="/brand/logo.png"
          alt="Accident Professionals"
          width="178"
          height="37"
          fetchpriority="high"
          loading="eager"
        />
      </a>

      <!-- <nav class="navbar__nav" aria-label="Primary navigation">
        <NuxtLink to="/auto-accidents" class="navbar__link">Auto Accidents</NuxtLink>
        <NuxtLink to="/car-accidents" class="navbar__link">Car Accidents</NuxtLink>
        <NuxtLink to="/truck-accidents" class="navbar__link">Truck Accidents</NuxtLink>
        <NuxtLink to="/motorcycle-accidents" class="navbar__link">Motorcycle</NuxtLink>
        <NuxtLink to="/rideshare-accidents" class="navbar__link">Rideshare</NuxtLink>
      </nav> -->

      <div class="navbar__contact">
        <div class="navbar__phone-wrap">
          <span class="navbar__question">Have Any Questions?</span>
          <a :href="config.public.phoneHref" class="navbar__phone" @click="gtmPush({ event: 'phone_click', location: 'navbar' })">{{
            config.public.phone
          }}</a>
        </div>
        <button class="navbar__cta" @click="scrollToContact">
          Get Free Consultation
        </button>
      </div>

      <a
        :href="config.public.phoneHref"
        class="navbar__mobile-phone"
        @click="gtmPush({ event: 'phone_click', location: 'navbar' })"
      >
        <img
          src="/services-page/auto-accidents/phone-icon-circle.png"
          alt=""
          width="36"
          height="36"
        />
        {{ config.public.phone }}
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'
import { useScrollToContact } from '../../composables/useScrollToContact'
const config = useRuntimeConfig();
const { push: gtmPush } = useDataLayer();
const { scrollToContact } = useScrollToContact();
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--color-white);
  box-shadow: var(--shadow-card);

  &__inner {
    display: flex;
    align-items: center;
    height: 90px;
    max-width: 1440px;
    margin-inline: auto;
    padding-inline: 40px;
    gap: 32px;

    @include tablet-down {
      padding-inline: 24px;
    }
  }

  &__logo {
    flex-shrink: 0;

    img {
      height: 37px;
      width: auto;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;

    @include tablet-down {
      display: none;
    }
  }

  &__link {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-muted);
    letter-spacing: -0.01em;
    transition: color var(--transition-base);
    white-space: nowrap;

    &:hover,
    &.router-link-active {
      color: var(--color-dark);
    }
  }

  &__contact {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
    flex-shrink: 0;

    @include tablet-down {
      display: none;
    }
  }

  &__phone-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__question {
    font-size: 13px;
    color: var(--color-muted);
    opacity: 0.7;
    line-height: 1;
    margin-bottom: 2px;
  }

  &__phone {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-dark);
    letter-spacing: -0.02em;
    line-height: 1;
    transition: color var(--transition-base);

    &:hover {
      color: var(--color-accent);
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding-inline: 24px;
    background: var(--color-accent);
    color: var(--color-dark);
    font-size: 16px;
    font-weight: 600;
    border-radius: var(--radius-pill);
    letter-spacing: -0.02em;
    white-space: nowrap;
    transition: transform var(--transition-base),
      box-shadow var(--transition-base);

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-button);
    }
  }

  &__mobile-phone {
    display: none;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: -0.02em;

    @include tablet-down {
      display: flex;
    }

    img {
      flex-shrink: 0;
    }
  }
}
</style>
