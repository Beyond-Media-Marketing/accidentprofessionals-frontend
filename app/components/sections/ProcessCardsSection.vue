<script setup lang="ts">
interface ProcessCard {
  icon?: string | null
  number?: string | null
  title?: string | null
  body?: string | null
  cta?: any
}
interface ProcessCards {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  cards?: ProcessCard[] | null
}

defineProps<{ block: ProcessCards | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section bg-white">
    <div class="site-container">
      <SectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" align="center" />

      <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 3xl:mt-16">
        <article
          v-for="(c, i) in block.cards ?? []"
          :key="i"
          class="relative flex flex-col overflow-hidden rounded-3xl bg-[#f3f2ef] p-8 lg:p-10"
        >
          <!-- Outlined number (same treatment as the services pages) -->
          <span
            v-if="c.number"
            class="process-number pointer-events-none absolute right-3 top-2 select-none font-primary text-[120px] font-bold leading-none lg:text-[140px]"
            aria-hidden="true"
          >
            {{ c.number }}
          </span>

          <!-- Icon (image already includes its circular background) -->
          <img
            v-if="c.icon"
            :src="c.icon"
            :alt="c.title || ''"
            class="relative z-10 h-[72px] w-[72px] object-contain"
            loading="lazy"
          />

          <h3 class="relative z-10 mt-8 font-primary text-xl font-semibold leading-snug text-dark 3xl:text-2xl">
            {{ c.title }}
          </h3>

          <div
            v-if="c.body"
            class="process-body relative z-10 mt-4 font-primary text-[15px] leading-relaxed text-dark/70"
            v-html="renderInlineMarkdown(c.body)"
          />

          <div v-if="c.cta?.label" class="relative z-10 mt-auto pt-8">
            <BaseButton
              :href="c.cta.href"
              :variant="c.cta.variant || 'primary'"
              :external="c.cta.external"
              :scroll-to="c.cta.scrollTo"
            >
              {{ c.cta.label }}
              <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
            </BaseButton>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Outlined number — same treatment as the services-page process section. */
.process-number {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(212, 148, 12, 0.2);
}
/* Paragraph spacing for the multi-paragraph card body. */
.process-body :deep(br) {
  content: '';
  display: block;
  margin-top: 0.85rem;
}
</style>
