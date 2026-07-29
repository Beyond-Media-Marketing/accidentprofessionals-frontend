<script setup lang="ts">
interface Attorney {
  name?: string | null
  slug?: string | null
  firm?: string | null
  location?: string | null
  yearsExperience?: number | null
  languages?: string | null
  practiceAreas?: string[] | null
  photo?: any
}
interface Cta {
  label?: string | null
  href?: string | null
  variant?: string | null
}

defineProps<{
  heading?: string | null
  subheading?: string | null
  cta?: Cta | null
  attorneys?: Attorney[] | null
}>()
</script>

<template>
  <section v-if="attorneys?.length" class="section bg-cream">
    <div class="site-container">
      <div v-if="heading || subheading" class="text-center">
        <h2 v-if="heading" class="font-secondary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.12] text-dark">{{ heading }}</h2>
        <p v-if="subheading" class="mx-auto mt-4 max-w-[720px] font-primary text-base leading-[1.7] text-muted">{{ subheading }}</p>
      </div>

      <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3" :class="(heading || subheading) ? 'mt-12 3xl:mt-16' : ''">
        <NuxtLink
          v-for="(a, i) in attorneys"
          :key="i"
          :to="`/legal-network/attorneys/${a.slug}`"
          class="group flex flex-col"
        >
          <!-- Photo + overlays -->
          <div class="relative overflow-hidden rounded-3xl">
            <div class="aspect-[4/5]">
              <img
                :src="strapiMedia(a.photo, '/services-page/auto-accidents/image1.webp')"
                :alt="a.name || 'Attorney'"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>

            <!-- Practice-area tags -->
            <div v-if="a.practiceAreas?.length" class="absolute left-3 right-3 top-3 flex flex-wrap gap-1.5">
              <span
                v-for="(tag, t) in a.practiceAreas.slice(0, 3)"
                :key="t"
                class="rounded-md bg-black/45 px-2.5 py-1 font-primary text-[11px] font-medium text-white backdrop-blur-sm"
              >{{ tag }}</span>
            </div>

            <!-- Stats strip -->
            <div class="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-px bg-white/10">
              <div class="bg-black/55 px-4 py-3 backdrop-blur-sm">
                <p class="font-secondary text-lg font-bold leading-none text-white">{{ a.yearsExperience }} Years</p>
                <p class="mt-1 font-primary text-[11px] text-accent">Experience</p>
              </div>
              <div class="bg-black/55 px-4 py-3 backdrop-blur-sm">
                <p class="font-secondary text-lg font-bold leading-none text-white">{{ a.languages }}</p>
                <p class="mt-1 font-primary text-[11px] text-white/60">Languages</p>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-4 flex items-start justify-between gap-3">
            <div>
              <p class="font-primary text-base font-semibold text-dark">{{ a.name }}</p>
              <p class="mt-0.5 font-primary text-sm text-accent">{{ a.firm }}</p>
            </div>
            <span
              class="inline-flex shrink-0 items-center gap-1 font-primary text-sm font-semibold text-accent group-hover:underline"
            >
              View Profile
              <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
          <p v-if="a.location" class="mt-2 flex items-center gap-1.5 font-primary text-sm text-muted">
            <svg class="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {{ a.location }}
          </p>
        </NuxtLink>
      </div>

      <div v-if="cta?.label" class="mt-12 flex justify-center 3xl:mt-16">
        <BaseButton :href="cta.href" :variant="cta.variant || 'primary'">
          {{ cta.label }}
          <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>
