<script setup lang="ts">
interface Cta {
  label?: string | null
  href?: string | null
  variant?: 'primary' | 'dark' | 'ghost' | null
  external?: boolean | null
  scrollTo?: string | null
}
interface Stat {
  value?: string | null
  label?: string | null
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string | null
    headingAccent?: string | null
    heading?: string | null
    subhead?: string | null
    align?: 'left' | 'center' | null
    primaryCta?: Cta | null
    secondaryCta?: Cta | null
    bgImage?: string | null
    stats?: Stat[] | null
  }>(),
  { align: 'left' },
)

const slots = useSlots()
const hasAside = computed(() => !!slots.aside)
const isCenter = computed(() => props.align === 'center')
</script>

<template>
  <section class="relative isolate overflow-hidden rounded-b-[32px] bg-dark text-on-dark 3xl:rounded-b-[48px]">
    <!-- Background image + readability gradients -->
    <div class="absolute inset-0 -z-10">
      <img v-if="bgImage" :src="bgImage" alt="" class="h-full w-full object-cover object-center" />
      <div class="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-dark/30" />
      <div class="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-dark/50" />
    </div>

    <div class="site-container">
      <div
        :class="[
          hasAside ? 'grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]' : '',
          'pt-24 pb-36 lg:pt-28 3xl:pt-36 3xl:pb-44',
        ]"
      >
        <!-- Copy -->
        <div :class="['max-w-[640px] 3xl:max-w-[760px]', isCenter ? 'mx-auto text-center' : '']">
          <span
            v-if="eyebrow"
            class="mb-5 inline-block rounded-pill border border-accent/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent"
          >
            {{ eyebrow }}
          </span>

          <h1 class="font-primary text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl 3xl:text-7xl">
            <span v-if="headingAccent" class="block text-accent">{{ headingAccent }}</span>
            <span v-if="heading" class="block text-white">{{ heading }}</span>
          </h1>

          <p
            v-if="subhead"
            class="hero-subhead mt-6 max-w-[560px] text-[15px] leading-relaxed text-white/70 3xl:text-base"
            :class="isCenter ? 'mx-auto' : ''"
            v-html="renderInlineMarkdown(subhead)"
          />

          <div
            v-if="primaryCta || secondaryCta"
            class="mt-8 flex flex-wrap gap-4"
            :class="isCenter ? 'justify-center' : ''"
          >
            <BaseButton
              v-if="primaryCta?.label"
              :href="primaryCta.href"
              :variant="primaryCta.variant || 'primary'"
              :external="primaryCta.external"
              :scroll-to="primaryCta.scrollTo"
            >
              {{ primaryCta.label }}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </BaseButton>
            <BaseButton
              v-if="secondaryCta?.label"
              :label="secondaryCta.label"
              :href="secondaryCta.href"
              :variant="secondaryCta.variant || 'ghost'"
              :external="secondaryCta.external"
              :scroll-to="secondaryCta.scrollTo"
            />
          </div>
        </div>

        <!-- Optional right column (e.g. lead form on the Services hero) -->
        <div v-if="hasAside">
          <slot name="aside" />
        </div>
      </div>
    </div>
  </section>

  <!-- Stats bar — overlaps the hero's bottom edge onto the page background -->
  <div v-if="stats?.length" class="relative z-10 -mt-16 3xl:-mt-20">
    <div class="site-container">
      <div class="grid grid-cols-2 overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-card md:grid-cols-4">
        <div
          v-for="(s, i) in stats"
          :key="i"
          class="px-6 py-7 text-center 3xl:py-9"
          :class="i > 0 ? 'md:border-l md:border-black/10' : ''"
        >
          <p class="font-primary text-3xl font-bold text-accent 3xl:text-4xl">{{ s.value }}</p>
          <p class="mx-auto mt-2 max-w-[180px] text-xs leading-snug text-muted 3xl:text-sm">{{ s.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Emphasised phrases inside the CMS-authored subhead read brighter. */
.hero-subhead :deep(strong) {
  color: #ffffff;
  font-weight: 600;
}
</style>
