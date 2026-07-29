<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Card {
  icon?: string | null
  iconImage?: any
  number?: string | null
  title?: string | null
  body?: string | null
}
interface Block {
  heading?: string | null
  intro?: string | null
  cards?: Card[] | null
}

defineProps<{ block: Block | null | undefined }>()

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function updateArrows() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 2
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
}

function scrollDir(dir: number) {
  const el = track.value
  if (!el) return
  const card = el.querySelector('article')
  const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}

onMounted(async () => {
  await nextTick()
  updateArrows()
})
</script>

<template>
  <section v-if="block" class="section bg-white">
    <div class="site-container">
      <SectionHeader :heading="block.heading" :intro="block.intro" align="center" />
    </div>

    <!-- Carousel: bleeds off the right edge, ~3.5 cards visible -->
    <div class="site-container mt-12 3xl:mt-16">
      <div
        ref="track"
        class="review-track -mr-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 3xl:-mr-10"
        @scroll.passive="updateArrows"
      >
        <article
          v-for="(c, i) in block.cards ?? []"
          :key="i"
          class="review-card relative flex w-[80%] shrink-0 snap-start flex-col gap-6 overflow-hidden rounded-2xl bg-cream p-8 sm:w-[330px] 3xl:w-[370px]"
        >
          <div class="relative z-10">
            <h3 class="mb-2 font-primary text-lg font-semibold leading-snug text-dark">{{ c.title }}</h3>
            <p class="font-primary text-sm leading-[1.55] text-dark/80">{{ c.body }}</p>
          </div>
        </article>
      </div>

      <!-- Arrows -->
      <div class="mt-8 flex justify-end gap-3 pr-6 3xl:pr-10">
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-dark/15 text-dark transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="atStart"
          aria-label="Previous"
          @click="scrollDir(-1)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-dark shadow-button transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          :disabled="atEnd"
          aria-label="Next"
          @click="scrollDir(1)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.review-track {
  scrollbar-width: none;
}
.review-track::-webkit-scrollbar {
  display: none;
}
</style>
