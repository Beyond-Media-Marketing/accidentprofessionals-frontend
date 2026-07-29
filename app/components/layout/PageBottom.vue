<script setup lang="ts">
// Closing CTA and footer are two SEPARATE bottom sections: the CTA is a rounded
// dark card (textured bg), then a cream gap, then the footer as its own dark
// section — so the CTA doesn't read as part of the footer.
// `flat` drops the footer's curved (rounded) top edge — used when the preceding
// section is already dark and should flow seamlessly into the footer.
defineProps<{ closingCta?: any | null; flat?: boolean }>()
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

    <!-- Closing CTA — a floating rounded card, its own section above the footer. -->
    <div v-if="closingCta" class="px-4 pb-5 sm:px-6 sm:pb-6 lg:px-8 3xl:px-10">
      <section class="relative isolate overflow-hidden rounded-[32px] bg-dark text-on-dark 3xl:rounded-[44px]">
        <div class="absolute inset-0 -z-10">
          <img src="/images/footer-bg.webp" alt="" class="h-full w-full object-cover object-center" />
          <div class="absolute inset-0 bg-dark/60" />
        </div>
        <ClosingCta :block="closingCta" />
      </section>
    </div>

    <!-- Footer — full-width section below the floating card. -->
    <div class="bg-dark text-on-dark" :class="flat ? '' : 'rounded-t-[32px] 3xl:rounded-t-[44px]'">
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
