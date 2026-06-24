<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'

interface Closing {
  heading?: string | null
  headingAccent?: string | null
  subtext?: string | null
  cta?: any
  note?: string | null
}

defineProps<{ block: Closing | null | undefined }>()

const globals = useGlobals()
const { push: gtmPush } = useDataLayer()
const settings = computed(() => globals.value.settings ?? {})
const phone = computed(() => settings.value.phone || '')
const phoneHref = computed(() => settings.value.phoneHref || '#')
</script>

<template>
  <!-- CTA content only; the shared dark background is provided by PageBottom. -->
  <div v-if="block" id="contact-section" class="site-container py-16 text-center text-on-dark 3xl:py-24">
    <h3 class="font-secondary text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl 3xl:text-6xl">
      <span class="text-white">{{ block.heading }}</span> <span v-if="block.headingAccent" class="text-accent">{{ block.headingAccent }}</span>
    </h3>

    <p
      v-if="block.subtext"
      class="mx-auto mt-4 max-w-2xl font-primary text-[15px] leading-relaxed text-white/70 3xl:text-base"
    >
      {{ block.subtext }}
    </p>

    <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
        v-if="phone"
        :href="phoneHref"
        class="inline-flex items-center gap-3 rounded-pill border border-white/10 bg-white/[0.06] py-2.5 pl-2.5 pr-6 shadow-[0_0_28px_-6px_rgba(243,175,0,0.5)] transition-colors hover:bg-white/10"
        @click="gtmPush({ event: 'phone_click', location: 'closing_cta' })"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-dark">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z"
            />
          </svg>
        </span>
        <span class="font-primary text-base font-semibold text-white">{{ phone }}</span>
      </a>

      <BaseButton
        v-if="block.cta?.label"
        :href="block.cta.href"
        :variant="block.cta.variant || 'primary'"
        :external="block.cta.external"
        :scroll-to="block.cta.scrollTo"
      >
        {{ block.cta.label }}
        <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
      </BaseButton>
    </div>

    <p v-if="block.note" class="mt-7 font-primary text-sm text-white/55">{{ block.note }}</p>
  </div>
</template>
