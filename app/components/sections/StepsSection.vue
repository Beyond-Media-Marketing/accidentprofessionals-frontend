<template>
  <section class="steps" ref="sectionRef" aria-labelledby="steps-heading">
    <div class="steps__inner">
      <div class="steps__header reveal">
        <h2 id="steps-heading">{{ data.heading }}</h2>
        <p class="steps__sub">{{ data.subheading }}</p>
      </div>

      <div class="steps__grid">
        <article
          v-for="(step, i) in data.steps"
          :key="i"
          class="steps__card reveal"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="steps__card-icon" aria-hidden="true">
            <img :src="step.icon" :alt="step.title" width="70" height="70" loading="lazy" />
          </div>
          <div class="steps__card-body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
          <span class="steps__card-number" aria-hidden="true">{{ step.number }}</span>
        </article>
      </div>

      <div class="steps__cta reveal">
        <AppButton tag="a" :href="config.public.phoneHref">
          {{ data.cta }}
          <img src="/services-page/auto-accidents/arrow-black.svg" alt="" width="18" height="18" />
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { stepsData as defaultData } from '../../data/auto-accidents'
const props = defineProps({ data: { default: () => defaultData } })
const data = props.data as typeof defaultData
const config = useRuntimeConfig()
const sectionRef = ref<HTMLElement | null>(null)
useRevealSection(sectionRef)
</script>

<style lang="scss" scoped>
.steps {
  background: var(--color-white);

  &__inner {
    @include container;
    @include section-padding;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 42px;
  }

  &__header {
    text-align: center;
    max-width: 876px;

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
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;
    width: 100%;

    > :nth-child(1) { grid-column: 1 / 3; }
    > :nth-child(2) { grid-column: 3 / 5; }
    > :nth-child(3) { grid-column: 5 / 7; }
    > :nth-child(4) { grid-column: 2 / 4; }
    > :nth-child(5) { grid-column: 4 / 6; }

    @include tablet {
      grid-template-columns: repeat(2, 1fr);

      > :nth-child(1),
      > :nth-child(2),
      > :nth-child(3),
      > :nth-child(4),
      > :nth-child(5) { grid-column: auto; }
    }

    @include mobile {
      grid-template-columns: 1fr;

      > :nth-child(1),
      > :nth-child(2),
      > :nth-child(3),
      > :nth-child(4),
      > :nth-child(5) { grid-column: auto; }
    }
  }

  &__card {
    background: var(--color-cream);
    border-radius: var(--radius-md);
    padding: 32px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 26px;
    min-height: 257px;
  }

  &__card-icon {
    flex-shrink: 0;

    img {
      width: 70px;
      height: 70px;
      object-fit: contain;
      display: block;
    }
  }

  &__card-body {
    position: relative;
    z-index: 1;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-dark);
      line-height: 1.55;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: var(--color-dark);
      line-height: 1.43;
      letter-spacing: -0.01em;
      opacity: 0.8;
    }
  }

  &__card-number {
    position: absolute;
    top: -16px;
    right: 12px;
    font-size: 120px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.61);
    line-height: 1;
    font-family: var(--font-primary);
    user-select: none;
    pointer-events: none;
  }

  &__cta {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
