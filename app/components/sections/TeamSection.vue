<template>
  <section class="bg-cream" ref="sectionRef" aria-labelledby="team-heading">
    <div class="site-container flex flex-col gap-[42px] py-12 md:py-[60px] min-[1200px]:py-20">

      <div class="reveal text-center">
        <h2
          id="team-heading"
          class="mb-4 font-primary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-dark"
        >{{ data.heading }}</h2>
        <p class="mx-auto max-w-[876px] text-base leading-[1.75] tracking-[-0.025em] text-muted">{{ data.subheading }}</p>
      </div>

      <!-- Desktop: paginated 3-up grid -->
      <div class="team__grid">
        <article
          v-for="(attorney, i) in paginated"
          :key="i"
          class="team__card"
          itemscope
          itemtype="https://schema.org/Person"
        >
          <div class="team__photo">
            <img :src="strapiMedia(attorney.image, '/services-page/auto-accidents/image1.webp')" :alt="attorney.name" itemprop="image" loading="lazy" />
            <div class="team__photo-stats">
              <div v-if="attorney.yearsExperience" class="team__photo-stat">
                <span class="team__photo-stat-value">{{ attorney.yearsExperience }}+ Years</span>
                <span class="team__photo-stat-label">Experience</span>
              </div>
              <div class="team__photo-stat">
                <span class="team__photo-stat-value">{{ attorney.location }}</span>
                <span class="team__photo-stat-label">Location</span>
              </div>
            </div>
          </div>
          <div class="team__info">
            <p class="team__name" itemprop="name">{{ attorney.name }}</p>
            <p class="team__firm" itemprop="worksFor">{{ attorney.firm }}</p>
            <p class="team__title" itemprop="jobTitle">{{ attorney.title }}</p>
            <p class="team__bio" itemprop="description">{{ attorney.bio }}</p>
          </div>
        </article>
      </div>

      <!-- Mobile: swipeable scroll-snap carousel (all attorneys) -->
      <div class="team__track" ref="trackRef" @scroll.passive="onTrackScroll">
        <article
          v-for="(attorney, i) in attorneys"
          :key="'m-' + i"
          class="team__card"
          itemscope
          itemtype="https://schema.org/Person"
        >
          <div class="team__photo">
            <img :src="strapiMedia(attorney.image, '/services-page/auto-accidents/image1.webp')" :alt="attorney.name" itemprop="image" loading="lazy" />
            <div class="team__photo-stats">
              <div v-if="attorney.yearsExperience" class="team__photo-stat">
                <span class="team__photo-stat-value">{{ attorney.yearsExperience }}+ Years</span>
                <span class="team__photo-stat-label">Experience</span>
              </div>
              <div class="team__photo-stat">
                <span class="team__photo-stat-value">{{ attorney.location }}</span>
                <span class="team__photo-stat-label">Location</span>
              </div>
            </div>
          </div>
          <div class="team__info">
            <p class="team__name" itemprop="name">{{ attorney.name }}</p>
            <p class="team__firm" itemprop="worksFor">{{ attorney.firm }}</p>
            <p class="team__title" itemprop="jobTitle">{{ attorney.title }}</p>
            <p class="team__bio" itemprop="description">{{ attorney.bio }}</p>
          </div>
        </article>
      </div>

      <!-- Unified pagination — ClientOnly prevents SSR/client isMobile mismatch -->
      <ClientOnly>
        <div class="team__pagination" role="navigation" aria-label="Attorney pages">
          <button
            class="team__page-arrow"
            :disabled="activeDot === 0"
            @click="prev"
            aria-label="Previous"
          >←</button>

          <button
            v-for="n in dotCount"
            :key="n"
            class="team__page-dot"
            :class="{ 'is-active': activeDot === n - 1 }"
            @click="goTo(n - 1)"
            :aria-label="`Go to ${n}`"
            :aria-current="activeDot === n - 1 ? 'page' : undefined"
          />

          <button
            class="team__page-arrow"
            :disabled="activeDot === dotCount - 1"
            @click="next"
            aria-label="Next"
          >→</button>
        </div>
      </ClientOnly>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps({ data: { type: Object, required: true } })
const data = computed<any>(() => props.data ?? {})
const attorneys = computed<any[]>(() => data.value.attorneys ?? [])

const PER_PAGE = 3
const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
useRevealSection(sectionRef)

const isMobile = useMediaQuery('(max-width: 767px)')

// Desktop pagination state
const page = ref(0)
const totalPages = computed(() => Math.ceil(attorneys.value.length / PER_PAGE))
const paginated = computed(() =>
  attorneys.value.slice(page.value * PER_PAGE, (page.value + 1) * PER_PAGE)
)

// Mobile carousel state
const mobileIndex = ref(0)

let rafPending = false
function onTrackScroll() {
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    rafPending = false
    const el = trackRef.value
    if (!el || !el.children.length) return
    const trackLeft = el.getBoundingClientRect().left
    let closest = 0
    let minDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs(child.getBoundingClientRect().left - trackLeft)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    mobileIndex.value = closest
  })
}

function scrollToCard(i: number) {
  const el = trackRef.value
  if (!el) return
  const child = el.children[i] as HTMLElement
  child?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
}

// Unified dot/arrow logic
const activeDot = computed(() => isMobile.value ? mobileIndex.value : page.value)
const dotCount = computed(() => isMobile.value ? attorneys.value.length : totalPages.value)

function prev() {
  if (isMobile.value) {
    if (mobileIndex.value > 0) scrollToCard(mobileIndex.value - 1)
  } else {
    if (page.value > 0) page.value--
  }
}

function next() {
  if (isMobile.value) {
    if (mobileIndex.value < attorneys.value.length - 1) scrollToCard(mobileIndex.value + 1)
  } else {
    if (page.value < totalPages.value - 1) page.value++
  }
}

function goTo(n: number) {
  if (isMobile.value) {
    scrollToCard(n)
  } else {
    page.value = n
  }
}
</script>

<!-- Plain CSS (no SCSS): the 3-up grid ↔ mobile scroll-snap carousel, photo
     overlay stats, and pagination dots/arrows. -->
<style scoped>
.team__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (min-width: 768px) and (max-width: 1199px) {
  .team__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767px) {
  .team__grid { display: none; }
}

.team__track { display: none; }
@media (max-width: 767px) {
  .team__track {
    display: flex;
    gap: 16px;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin-inline: -24px;
    padding-inline: 24px;
    scroll-padding-inline-start: 24px;
  }
  .team__track::-webkit-scrollbar { display: none; }
  .team__track .team__card {
    flex-shrink: 0;
    width: 82%;
    scroll-snap-align: start;
  }
}

.team__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.team__photo {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 384px;
}
.team__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
.team__photo-stats {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
}
.team__photo-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 10px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  background: rgba(150, 150, 150, 0.19);
  flex: 0 0 calc(50% - 4px);
}
.team__photo-stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-white);
  line-height: 1.5;
  white-space: nowrap;
}
.team__photo-stat-label {
  font-size: 11px;
  color: #ffda79;
  line-height: 1.5;
}
.team__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.team__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.4;
}
.team__firm {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: -0.01em;
}
.team__title {
  font-size: 14px;
  color: var(--color-muted);
  margin-bottom: 4px;
}
.team__bio {
  font-size: 14px;
  color: var(--color-dark);
  line-height: 1.6;
  opacity: 0.75;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.team__page-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border, #e0dcd8);
  background: var(--color-white);
  color: var(--color-dark);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
}
.team__page-arrow:hover:not(:disabled) {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-dark);
}
.team__page-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.team__page-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: var(--color-muted);
  opacity: 0.35;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.25s ease, background 0.25s ease, transform 0.25s ease;
}
.team__page-dot.is-active {
  background: var(--color-accent);
  opacity: 1;
  transform: scale(1.3);
}
.team__page-dot:hover:not(.is-active) {
  opacity: 0.65;
}
</style>
