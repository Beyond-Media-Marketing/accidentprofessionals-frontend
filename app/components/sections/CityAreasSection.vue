<script setup lang="ts">
interface City {
  name?: string | null
  href?: string | null
}
interface Region {
  region?: string | null
  cities?: City[] | null
}
interface CityAreas {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  regions?: Region[] | null
}

const props = defineProps<{ block: CityAreas | null | undefined }>()

const regions = computed<Region[]>(() => props.block?.regions ?? [])
const activeIndex = ref(0)
const activeCities = computed<City[]>(() => regions.value[activeIndex.value]?.cities ?? [])

// "Atlanta, GA" -> "Atlanta" for the "Get Help in …" link.
const shortName = (name?: string | null) => (name ?? '').replace(/,.*$/, '').trim()
</script>

<template>
  <section v-if="block" class="section relative isolate overflow-hidden bg-dark text-on-dark">
    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :heading-accent="block.headingAccent"
        align="center"
        theme="dark"
      />

      <!-- Region tabs -->
      <div
        v-if="regions.length > 1"
        class="mt-10 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:flex-nowrap 3xl:mt-12"
        role="tablist"
      >
        <button
          v-for="(r, i) in regions"
          :key="i"
          type="button"
          role="tab"
          :aria-selected="activeIndex === i"
          class="flex-1 whitespace-nowrap rounded-xl px-4 py-3 text-center font-primary text-sm font-semibold transition-colors"
          :class="activeIndex === i ? 'bg-accent text-dark' : 'text-white/60 hover:text-white'"
          @click="activeIndex = i"
        >
          {{ r.region }}
        </button>
      </div>

      <!-- City cards -->
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:mt-10">
        <NuxtLink
          v-for="(city, i) in activeCities"
          :key="i"
          :to="city.href || '#'"
          class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-accent/40 hover:bg-white/[0.07]"
        >
          <img src="/icons/location-pin.png" alt="" class="h-10 w-10 shrink-0" loading="lazy" />
          <span class="min-w-0">
            <span class="block font-secondary text-lg font-semibold text-white">{{ city.name }}</span>
            <span class="mt-0.5 inline-flex items-center gap-1.5 font-primary text-sm font-semibold text-accent">
              Get Help in {{ shortName(city.name) }}
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
