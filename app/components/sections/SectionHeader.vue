<script setup lang="ts">
interface Cta {
  label?: string | null
  href?: string | null
  variant?: 'primary' | 'dark' | 'ghost' | null
  external?: boolean | null
  scrollTo?: string | null
}

withDefaults(
  defineProps<{
    eyebrow?: string | null
    heading?: string | null
    /** Optional accent-coloured word(s) appended inline to the heading. */
    headingAccent?: string | null
    /** Markdown/rich-text string (supports **bold**, links). */
    intro?: string | null
    cta?: Cta | null
    align?: 'left' | 'center' | null
    /** 'light' (default, dark text on light bg) or 'dark' (light text on dark bg). */
    theme?: 'light' | 'dark' | null
  }>(),
  { align: 'center', theme: 'light' },
)
</script>

<template>
  <div :class="['flex flex-col', align === 'center' ? 'items-center text-center' : 'items-start text-left']">
    <span
      v-if="eyebrow"
      class="mb-6 inline-block rounded-[40px] border px-[21px] py-3 font-inter text-[14.6px] font-semibold leading-[22.4px] tracking-[-0.32px]"
      :class="theme === 'dark' ? 'border-white/20 text-white/80' : 'border-[#525252]/15 text-[#100E0B]/60'"
    >
      {{ eyebrow }}
    </span>

    <h2
      v-if="heading || headingAccent"
      class="font-secondary font-semibold leading-[1.12] text-[clamp(1.8rem,3.5vw,3.125rem)]"
      :class="theme === 'dark' ? 'text-white' : 'text-dark'"
    >
      <span>{{ heading }}</span> <span v-if="headingAccent" class="text-accent">{{ headingAccent }}</span>
    </h2>

    <p
      v-if="intro"
      class="section-intro mt-4 max-w-4xl font-primary text-base leading-[1.75] tracking-[-0.015em]"
      :class="theme === 'dark' ? 'is-dark text-white/70' : 'text-muted'"
      v-html="renderInlineMarkdown(intro)"
    />

    <BaseButton
      v-if="cta?.label"
      class="mt-8"
      :href="cta.href"
      :variant="cta.variant || 'primary'"
      :external="cta.external"
      :scroll-to="cta.scrollTo"
    >
      {{ cta.label }}
      <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
    </BaseButton>
  </div>
</template>

<style scoped>
/* Emphasised phrases in the CMS intro read darker on light backgrounds. */
.section-intro :deep(strong) {
  color: var(--color-dark);
  font-weight: 600;
}
.section-intro.is-dark :deep(strong) {
  color: #ffffff;
}
.section-intro :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
