<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'

const globals = useGlobals()
const { push: gtmPush } = useDataLayer()

const settings = computed(() => globals.value.settings ?? {})
const phoneHref = computed(() => settings.value.phoneHref || '#')
const hasPhone = computed(() => !!settings.value.phone)
</script>

<template>
  <a
    v-if="hasPhone"
    :href="phoneHref"
    class="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex 3xl:right-6"
    aria-label="Call us now"
    @click="gtmPush({ event: 'phone_click', location: 'side_cta' })"
  >
    <span
      class="text-[11px] font-semibold uppercase tracking-widest text-accent [writing-mode:vertical-rl]"
    >
      Call Us Now
    </span>
    <span
      class="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-dark shadow-button transition-transform hover:scale-105"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z"
        />
      </svg>
    </span>
  </a>
</template>
