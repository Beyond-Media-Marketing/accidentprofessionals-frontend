<script setup lang="ts">
interface Item {
  quote?: string | null
  name?: string | null
  location?: string | null
  rating?: number | null
}
interface Testimonials {
  heading?: string | null
  headingAccent?: string | null
  items?: Item[] | null
}
defineProps<{ block: Testimonials | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section overflow-hidden bg-cream">
    <div class="site-container">
      <h2 class="mx-auto max-w-[720px] text-center font-secondary text-3xl font-bold leading-tight text-dark sm:text-4xl 3xl:text-5xl">
        {{ block.heading }}
        <span v-if="block.headingAccent" class="text-accent">{{ block.headingAccent }}</span>
      </h2>
    </div>

    <!-- Horizontal scroll-snap carousel (breaks out of container on the right) -->
    <div class="site-container mt-12 3xl:mt-16">
      <div class="-mr-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <article
          v-for="(t, i) in block.items ?? []"
          :key="i"
          class="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-[#F7F2E9] p-7 sm:w-[360px]"
        >
          <img src="/icons/quote.svg" alt="" class="mx-auto h-9 w-auto" loading="lazy" />
          <p class="mt-5 flex-1 font-primary text-[15px] font-light leading-relaxed text-[#212529]">{{ t.quote }}</p>
          <div class="mt-6 flex items-end justify-between gap-4">
            <div>
              <p class="font-primary text-sm font-bold text-dark">{{ t.name }}</p>
              <p class="font-primary text-xs text-[#616161]">{{ t.location }}</p>
            </div>
            <div class="flex shrink-0 gap-0.5 text-accent" :aria-label="`${t.rating || 5} stars`" role="img">
              <svg v-for="n in (t.rating || 5)" :key="n" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
