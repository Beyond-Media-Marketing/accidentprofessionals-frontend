<template>
  <header class="navbar">
    <div class="navbar__inner">
      <NuxtLink
        to="/"
        class="navbar__logo"
        aria-label="Accident Professionals — Home"
      >
        <img
          src="/brand/logo.png"
          alt="Accident Professionals"
          width="178"
          height="37"
        />
      </NuxtLink>

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
          <a :href="config.public.phoneHref" class="navbar__phone">{{
            config.public.phone
          }}</a>
        </div>
        <a :href="config.public.phoneHref" class="navbar__cta">
          Get Free Consultation
        </a>
      </div>

      <button
        class="navbar__burger"
        :class="{ 'is-open': menuOpen }"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>
    </div>

    <div class="navbar__mobile-menu" :class="{ 'is-open': menuOpen }">
      <NuxtLink
        to="/auto-accidents"
        class="navbar__mobile-link"
        @click="menuOpen = false"
        >Auto Accidents</NuxtLink
      >
      <NuxtLink
        to="/car-accidents"
        class="navbar__mobile-link"
        @click="menuOpen = false"
        >Car Accidents</NuxtLink
      >
      <NuxtLink
        to="/truck-accidents"
        class="navbar__mobile-link"
        @click="menuOpen = false"
        >Truck Accidents</NuxtLink
      >
      <NuxtLink
        to="/motorcycle-accidents"
        class="navbar__mobile-link"
        @click="menuOpen = false"
        >Motorcycle</NuxtLink
      >
      <NuxtLink
        to="/rideshare-accidents"
        class="navbar__mobile-link"
        @click="menuOpen = false"
        >Rideshare</NuxtLink
      >
      <a :href="config.public.phoneHref" class="navbar__mobile-cta">{{
        config.public.phone
      }}</a>
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const menuOpen = ref(false);
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

  &__burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
    margin-left: auto;
    cursor: pointer;

    @include tablet-down {
      display: flex;
    }

    span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--color-dark);
      border-radius: 2px;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }

    &.is-open {
      span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }
  }

  &__mobile-menu {
    display: none;
    flex-direction: column;
    background: var(--color-white);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.35s ease;

    @include tablet-down {
      display: flex;
    }

    &.is-open {
      max-height: 400px;
    }
  }

  &__mobile-link {
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-dark);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: color var(--transition-base);

    &:hover {
      color: var(--color-accent);
    }
  }

  &__mobile-cta {
    margin: 16px 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 24px;
    background: var(--color-accent);
    color: var(--color-dark);
    font-size: 16px;
    font-weight: 600;
    border-radius: var(--radius-pill);
    text-align: center;
  }
}
</style>
