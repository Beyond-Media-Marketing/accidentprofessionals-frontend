<template>
  <a
    class="side-cta"
    :href="config.public.phoneHref"
    aria-label="Call us now"
    @click="gtmPush({ event: 'phone_click', location: 'side_cta' })"
  >
    <span class="side-cta__text">CALL US NOW</span>
    <img
      src="/services-page/auto-accidents/phone-icon-circle.png"
      alt=""
      width="52"
      height="52"
    />
  </a>
</template>

<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'
const config = useRuntimeConfig()
const { push: gtmPush } = useDataLayer()
</script>

<style lang="scss" scoped>
.side-cta {
  position: fixed;
  right: 0;
  bottom: 120px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-right: 7px;
  text-decoration: none;
  transition: transform var(--transition-base);

  &:hover {
    transform: scale(1.05);
  }

  &__text {
    writing-mode: vertical-rl;
    transform: rotate(360deg);
    font-size: 18px;
    font-weight: 600;
    font-family: var(--font-primary);
    color: var(--color-accent);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  img {
    width: 52px;
    height: 52px;
    object-fit: contain;
    display: block;
  }

  @include tablet-down {
    display: none;
  }
}
</style>
