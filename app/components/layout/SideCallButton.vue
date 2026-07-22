<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'

// "Call Us Now" sticky — same design as the legacy pages (AppSideCta), rebuilt
// as a reusable Tailwind component driven by Strapi globals.
const globals = useGlobals()
const config = useRuntimeConfig()
const { push: gtmPush } = useDataLayer()

const settings = computed(() => globals.value.settings ?? {})
const phoneHref = computed(() => settings.value.phoneHref || config.public.phoneHref || '#')
const hasPhone = computed(() => !!(settings.value.phone || config.public.phone))
</script>

<template>
  <a
    v-if="hasPhone"
    :href="phoneHref"
    aria-label="Call us now"
    class="group fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent font-primary text-dark shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 lg:h-auto lg:w-auto lg:justify-start lg:gap-2.5 lg:rounded-pill lg:py-3 lg:pl-3 lg:pr-5 lg:text-[15px] lg:font-semibold lg:bottom-6 lg:right-6 3xl:bottom-8 3xl:right-8"
    @click="gtmPush({ event: 'phone_click', location: 'side_cta' })"
  >
    <span class="relative flex h-9 w-9 items-center justify-center rounded-full text-dark lg:bg-dark lg:text-accent">
      <span class="absolute inset-0 animate-ping rounded-full bg-dark/30 [animation-duration:2.5s]" aria-hidden="true" />
      <svg class="relative h-[20px] w-[20px] lg:h-[18px] lg:w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02l-2.2 2.2z" />
      </svg>
    </span>
    <span class="hidden lg:inline">Call Us Now</span>
  </a>
</template>
