<script setup lang="ts">
interface Step {
  number?: string | null
  title?: string | null
  description?: string | null
}
interface ProcessBlock {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  cta?: any
  steps?: Step[] | null
  highlightTitle?: string | null
  highlightText?: string | null
}

defineProps<{
  block: ProcessBlock | null | undefined
  /** Resolved image URL (Strapi media or /public fallback). */
  image?: string | null
  imageAlt?: string | null
  /** Resolved highlight icon URL. */
  highlightIcon?: string | null
}>()

const pad = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :intro="block.intro"
        :cta="block.cta"
        align="center"
      />

      <div class="mt-12 grid items-center gap-6 lg:grid-cols-[587px_minmax(0,1fr)] 3xl:mt-14">
        <!-- Image + floating highlight card -->
        <div class="relative">
          <div class="h-[240px] overflow-hidden rounded-3xl md:h-[320px] lg:h-[556px]">
            <img
              v-if="image"
              :src="image"
              :alt="imageAlt || block.heading || 'Accident Professionals'"
              width="587"
              height="556"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>

          <div
            v-if="block.highlightTitle"
            class="goal-card absolute bottom-4 left-4 right-4 rounded-3xl px-6 py-8 backdrop-blur-[50px] lg:bottom-[-50px] lg:left-[-48px] lg:right-auto lg:w-[447px]"
          >
            <div class="flex items-center gap-[26px]">
              <img v-if="highlightIcon" :src="highlightIcon" alt="" class="h-[70px] w-[70px] shrink-0" />
              <div class="flex flex-col gap-2">
                <p class="font-primary text-lg font-semibold leading-7 text-white">{{ block.highlightTitle }}</p>
                <p class="font-primary text-sm font-medium leading-5 tracking-[-0.15px] text-white">
                  {{ block.highlightText }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Numbered steps -->
        <div class="flex flex-col gap-8">
          <article
            v-for="(step, i) in block.steps ?? []"
            :key="i"
            class="flex items-center gap-6 rounded-3xl bg-white p-7 md:gap-7 md:p-8"
          >
            <span
              class="min-w-[44px] flex-shrink-0 select-none text-center font-primary text-[56px] font-bold leading-none text-accent/[0.18] md:min-w-[80px] md:text-[100px]"
              aria-hidden="true"
            >
              {{ step.number || pad(i) }}
            </span>
            <div>
              <h3 class="font-primary text-xl font-semibold leading-[1.3] text-dark">
                {{ step.title }}
              </h3>
              <p class="mt-2 font-primary text-base leading-[1.65] tracking-[-0.02em] text-muted">
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* "Goal is simple" card — exact fill from Figma: 10% black + 15% white over
   24% gold, behind a heavy backdrop blur. */
.goal-card {
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)),
    rgba(243, 175, 0, 0.24);
}
</style>
