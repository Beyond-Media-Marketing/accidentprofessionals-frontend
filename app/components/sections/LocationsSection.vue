<script setup lang="ts">
interface City {
  name?: string | null
  href?: string | null
}
interface Locations {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  intro?: string | null
  cities?: City[] | null
  ctaHeading?: string | null
  ctaBody?: string | null
  cta?: any
}

defineProps<{
  block: Locations | null | undefined
  /** Resolved background image URL. */
  bgImage?: string | null
}>()
</script>

<template>
  <section v-if="block" class="section relative isolate overflow-hidden bg-dark text-on-dark">
    <div class="absolute inset-0 -z-10">
      <img v-if="bgImage" :src="bgImage" alt="" class="h-full w-full object-cover" loading="lazy" decoding="async" />
      <div class="absolute inset-0 bg-dark/40" />
    </div>

    <div class="site-container">
      <div class="grid items-start gap-12 lg:grid-cols-2 3xl:gap-16">
        <!-- Left: header -->
        <SectionHeader
          :eyebrow="block.eyebrow"
          :heading="block.heading"
          :heading-accent="block.headingAccent"
          :intro="block.intro"
          align="left"
          theme="dark"
        />

        <!-- Right: city list — wrapping horizontal flex on mobile, 2-col grid from sm up -->
        <div class="flex flex-wrap gap-x-6 gap-y-4 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 lg:pt-2">
          <template v-for="(city, i) in block.cities ?? []" :key="i">
            <NuxtLink v-if="city.href" :to="city.href" class="group flex items-center gap-3">
              <img src="/icons/location-pin.png" alt="" class="h-11 w-11 shrink-0" loading="lazy" />
              <span class="font-primary text-base text-white transition-colors group-hover:text-accent">{{ city.name }}</span>
            </NuxtLink>
            <div v-else class="flex items-center gap-3">
              <img src="/icons/location-pin.png" alt="" class="h-11 w-11 shrink-0" loading="lazy" />
              <span class="font-primary text-base text-white">{{ city.name }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Bottom: "Don't see your city?" card -->
      <div
        v-if="block.ctaHeading"
        class="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center 3xl:mt-16 3xl:py-16"
      >
        <h3 class="font-secondary text-3xl font-semibold text-white sm:text-4xl">{{ block.ctaHeading }}</h3>
        <p v-if="block.ctaBody" class="mx-auto mt-4 max-w-3xl font-primary text-[15px] leading-relaxed text-white/70">
          {{ block.ctaBody }}
        </p>
        <div v-if="block.cta?.label" class="mt-7 flex justify-center">
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
    </div>
  </section>
</template>
