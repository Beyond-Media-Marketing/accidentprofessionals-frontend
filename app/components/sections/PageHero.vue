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
    /** 'card' = single white bar (home); 'pills' = separate dark chips (about). */
    statsVariant?: 'card' | 'pills' | null
  }>(),
  { align: 'left', statsVariant: 'card' },
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

          <h1 class="font-secondary text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl 3xl:text-7xl">
            <span v-if="headingAccent" class="block text-accent">{{ headingAccent }}</span>
            <span v-if="heading" class="block text-white">{{ heading }}</span>
          </h1>

          <p
            v-if="subhead"
            class="hero-subhead mt-6 max-w-[560px] font-primary text-[15px] leading-relaxed text-white/70 3xl:text-base"
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
              <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
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

  <!-- Stats — overlaps the hero's bottom edge -->
  <div v-if="stats?.length" class="relative z-10 -mt-12 3xl:-mt-16">
    <div class="site-container">
      <!-- Pills variant (about): separate dark chips -->
      <div v-if="statsVariant === 'pills'" class="flex flex-wrap justify-center gap-3 sm:gap-4">
        <div
          v-for="(s, i) in stats"
          :key="i"
          class="inline-flex items-center gap-2.5 rounded-pill border border-white/10 bg-dark/80 px-5 py-3 backdrop-blur 3xl:px-6 3xl:py-4"
        >
          <span class="font-secondary text-xl font-bold text-accent 3xl:text-2xl">{{ s.value }}</span>
          <span class="max-w-[170px] font-primary text-xs leading-snug text-white/70 3xl:text-sm">{{ s.label }}</span>
        </div>
      </div>

      <!-- Card variant (home): single white bar -->
      <div v-else class="grid grid-cols-2 rounded-[28px] bg-white/[0.81] shadow-card backdrop-blur-sm md:grid-cols-4">
        <div
          v-for="(s, i) in stats"
          :key="i"
          class="relative px-6 py-7 text-center font-inter 3xl:py-9"
          :class="
            i > 0
              ? `md:before:absolute md:before:left-0 md:before:top-1/2 md:before:h-14 md:before:w-px md:before:-translate-y-1/2 md:before:bg-white md:before:content-['']`
              : ''
          "
        >
          <p class="text-4xl font-bold text-accent 3xl:text-5xl">{{ s.value }}</p>
          <p class="mx-auto mt-2 max-w-[180px] text-xs leading-snug text-[#1E1E1E]/50 3xl:text-sm">{{ s.label }}</p>
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
/* Internal/external links editors add via the rich-text field. */
.hero-subhead :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s ease;
}
.hero-subhead :deep(a):hover {
  opacity: 0.85;
}
</style>
