<template>
  <section class="team" ref="sectionRef" aria-labelledby="team-heading">
    <div class="team__inner">

      <div class="team__header reveal">
        <h2 id="team-heading">{{ data.heading }}</h2>
        <p class="team__sub">{{ data.subheading }}</p>
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
            <img :src="attorney.image" :alt="attorney.name" itemprop="image" loading="lazy" />
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
            <img :src="attorney.image" :alt="attorney.name" itemprop="image" loading="lazy" />
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

<style lang="scss" scoped>
.team {
  background: var(--color-cream);

  &__inner {
    @include container;
    @include section-padding;
    display: flex;
    flex-direction: column;
    gap: 42px;
  }

  &__header {
    text-align: center;

    h2 {
      font-size: clamp(1.8rem, 3.5vw, 3.125rem);
      color: var(--color-dark);
      margin-bottom: 16px;
    }
  }

  &__sub {
    font-size: 16px;
    color: var(--color-muted);
    line-height: 1.75;
    letter-spacing: -0.025em;
    max-width: 876px;
    margin-inline: auto;
  }

  // Desktop grid — hide on mobile
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mobile {
      display: none;
    }
  }

  // Mobile carousel — hide on desktop/tablet
  &__track {
    display: none;

    @include mobile {
      display: flex;
      gap: 16px;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      // Break out of the container padding so first card aligns with content edge
      margin-inline: -24px;
      padding-inline: 24px;
      scroll-padding-inline-start: 24px;

      &::-webkit-scrollbar { display: none; }

      .team__card {
        flex-shrink: 0;
        width: 82%;
        scroll-snap-align: start;
      }
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__photo {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    height: 384px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }

  &__photo-stats {
    position: absolute;
    bottom: 24px;
    left: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
  }

  &__photo-stat {
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

  &__photo-stat-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-white);
    line-height: 1.5;
    white-space: nowrap;
  }

  &__photo-stat-label {
    font-size: 11px;
    color: #ffda79;
    line-height: 1.5;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__name {
    font-size: 17px;
    font-weight: 700;
    color: var(--color-dark);
    line-height: 1.4;
  }

  &__firm {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: -0.01em;
  }

  &__title {
    font-size: 14px;
    color: var(--color-muted);
    margin-bottom: 4px;
  }

  &__bio {
    font-size: 14px;
    color: var(--color-dark);
    line-height: 1.6;
    opacity: 0.75;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__page-arrow {
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
    transition: background var(--transition-base), border-color var(--transition-base), opacity var(--transition-base);

    &:hover:not(:disabled) {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-dark);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__page-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: var(--color-muted);
    opacity: 0.35;
    cursor: pointer;
    padding: 0;
    transition: opacity var(--transition-base), background var(--transition-base), transform var(--transition-base);

    &.is-active {
      background: var(--color-accent);
      opacity: 1;
      transform: scale(1.3);
    }

    &:hover:not(.is-active) {
      opacity: 0.65;
    }
  }
}
</style>
