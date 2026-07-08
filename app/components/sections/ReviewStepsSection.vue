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
          class="review-card relative flex min-h-[260px] w-[80%] shrink-0 snap-start flex-col gap-6 overflow-hidden rounded-2xl bg-cream p-8 sm:w-[330px] 3xl:w-[370px]"
        >
          <!-- Icon: uploaded image (no container) with glyph fallback until uploaded -->
          <img
            v-if="strapiMedia(c.iconImage)"
            :src="strapiMedia(c.iconImage)"
            alt=""
            class="relative z-10 h-14 w-14 object-contain"
            loading="lazy"
          />
          <span v-else class="relative z-10 text-accent">
            <svg class="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <template v-if="c.icon === 'phone'">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </template>
              <template v-else-if="c.icon === 'alert'">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </template>
              <template v-else-if="c.icon === 'camera'">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </template>
              <template v-else>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </template>
            </svg>
          </span>

          <div class="relative z-10">
            <h3 class="mb-2 font-primary text-lg font-semibold leading-snug text-dark">{{ c.title }}</h3>
            <p class="font-primary text-sm leading-[1.55] text-dark/80">{{ c.body }}</p>
          </div>

          <!-- Yellow-outlined number -->
          <span v-if="c.number" class="review-card__number" aria-hidden="true">{{ c.number }}</span>
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
/* Outlined (yellow text-stroke) number — same treatment as the Steps section. */
.review-card__number {
  position: absolute;
  top: 4px;
  right: 14px;
  font-size: 110px;
  font-weight: 700;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(212, 148, 12, 0.2);
  font-family: var(--font-primary);
  user-select: none;
  pointer-events: none;
}
</style>
