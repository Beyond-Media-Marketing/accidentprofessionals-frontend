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
    class="fixed bottom-[120px] right-0 z-50 hidden flex-col items-center gap-3 pr-[7px] transition-transform hover:scale-105 lg:flex"
    @click="gtmPush({ event: 'phone_click', location: 'side_cta' })"
  >
    <span
      class="font-primary text-[18px] font-semibold tracking-[-0.02em] text-accent [writing-mode:vertical-rl]"
    >
      CALL US NOW
    </span>
    <img src="/icons/call-us-phone.png" alt="" width="52" height="52" class="block h-[52px] w-[52px] object-contain" />
  </a>
</template>
