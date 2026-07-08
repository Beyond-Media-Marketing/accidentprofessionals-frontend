<script setup lang="ts">
interface Card {
  icon?: string | null
  title?: string | null
  description?: string | null
  linkLabel?: string | null
  linkHref?: string | null
}
interface CardGrid {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  cta?: any
  features?: Card[] | null
}

defineProps<{
  block: CardGrid | null | undefined
  /** White section + cream (F7F2E9) cards with a smaller icon stacked on top of the title. */
  stacked?: boolean
}>()
</script>

<template>
  <section v-if="block" class="section" :class="stacked ? 'bg-white' : 'bg-cream'">
    <div class="site-container">
      <SectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" align="center" />

      <div
        class="mt-12 grid grid-cols-1 gap-6 3xl:mt-16"
        :class="stacked ? 'sm:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2'"
      >
        <article
          v-for="(c, i) in block.features ?? []"
          :key="i"
          :class="stacked
            ? 'flex flex-col rounded-3xl bg-[#F7F2E9] p-6 3xl:p-7'
            : 'flex gap-5 rounded-3xl border border-black/5 bg-white p-6 shadow-card 3xl:p-7'"
        >
          <img
            :src="strapiMedia(c.icon, '/icons/shield.svg')"
            :alt="c.title || ''"
            :class="stacked ? 'mb-4 h-9 w-9' : 'h-14 w-14 shrink-0 3xl:h-16 3xl:w-16'"
            loading="lazy"
          />
          <div class="flex flex-1 flex-col">
            <h3 class="font-primary text-xl font-semibold leading-snug text-dark">{{ c.title }}</h3>
            <p class="mt-2 font-primary text-sm leading-relaxed text-muted">{{ c.description }}</p>
            <NuxtLink
              v-if="c.linkLabel"
              :to="c.linkHref || '#'"
              class="mt-auto inline-flex items-center gap-2 pt-4 font-primary text-base font-semibold leading-6 tracking-[-0.3125px] text-[#AC8C66] transition-opacity hover:opacity-80"
            >
              {{ c.linkLabel }}
              <svg
                class="h-[18px] w-[18px]"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3.75 9h10.5M9 3.75 14.25 9 9 14.25" />
              </svg>
            </NuxtLink>
          </div>
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
