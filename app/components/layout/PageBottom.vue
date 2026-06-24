<script setup lang="ts">
// Closing CTA + footer sharing one continuous textured background (the same
// footer-bg used on the legacy services pages). The light lead heading sits
// above the shared dark area.
defineProps<{ closingCta?: any | null }>()
</script>

<template>
  <div>
    <!-- Lead heading (light) -->
    <div v-if="closingCta?.leadHeading" class="bg-cream pb-14 pt-2 3xl:pb-20">
      <div class="site-container">
        <h2
          class="closing-lead text-center font-secondary text-4xl font-bold leading-[1.1] text-dark sm:text-5xl lg:text-6xl 3xl:text-7xl"
          v-html="renderInlineMarkdown(closingCta.leadHeading)"
        />
      </div>
    </div>

    <!-- Shared background spanning the CTA + footer -->
    <div class="relative isolate overflow-hidden rounded-t-[32px] bg-dark 3xl:rounded-t-[44px]">
      <div class="absolute inset-0 -z-10">
        <img src="/images/footer-bg.webp" alt="" class="h-full w-full object-cover object-top" />
        <div class="absolute inset-0 bg-dark/55" />
      </div>

      <ClosingCta v-if="closingCta" :block="closingCta" />
      <SiteFooter />
    </div>
  </div>
</template>

<style scoped>
/* Accent (gold) words in the lead heading — marked with **bold** in the CMS. */
.closing-lead :deep(strong) {
  color: var(--color-accent);
  font-weight: inherit;
}
</style>
