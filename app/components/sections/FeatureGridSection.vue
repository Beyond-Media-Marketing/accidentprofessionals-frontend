<script setup lang="ts">
interface Feature {
  icon?: string | null
  title?: string | null
  description?: string | null
}
interface FeatureGrid {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  cta?: any
  features?: Feature[] | null
}

defineProps<{
  block: FeatureGrid | null | undefined
  /** Resolved background image URL (Strapi media or /public fallback). */
  bgImage?: string | null
}>()
</script>

<template>
  <section v-if="block" class="section relative isolate overflow-hidden bg-dark text-on-dark">
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <img v-if="bgImage" :src="bgImage" alt="" class="h-full w-full object-cover" loading="lazy" decoding="async" />
      <div class="absolute inset-0 bg-dark/40" />
    </div>

    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :intro="block.intro"
        align="center"
        theme="dark"
      />

      <!-- 2-then-3 card grid (first two span wider) -->
      <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 3xl:mt-16">
        <article
          v-for="(f, i) in block.features ?? []"
          :key="i"
          class="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:items-start 3xl:p-8"
          :class="i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'"
        >
          <img v-if="strapiMedia(f.icon)" :src="strapiMedia(f.icon)" alt="" class="col-start-1 row-start-1 h-16 w-16 shrink-0 sm:row-span-2 3xl:h-[72px] 3xl:w-[72px]" loading="lazy" />
          <h3 class="col-start-2 row-start-1 font-primary text-lg font-semibold text-white">{{ f.title }}</h3>
          <p class="col-start-1 col-span-2 row-start-2 font-primary text-sm leading-relaxed text-white/60 sm:col-start-2 sm:col-span-1">{{ f.description }}</p>
        </article>
      </div>

      <div v-if="block.cta?.label" class="mt-10 flex justify-center 3xl:mt-12">
        <BaseButton
          :href="block.cta.href"
          :variant="block.cta.variant || 'primary'"
          :external="block.cta.external"
          :scroll-to="block.cta.scrollTo"
        >
          {{ block.cta.label }}
          <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>
