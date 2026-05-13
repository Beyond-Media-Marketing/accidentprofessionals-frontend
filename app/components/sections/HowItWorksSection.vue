<template>
  <section class="how" ref="sectionRef" aria-labelledby="how-heading">
    <div class="how__inner">
      <div class="how__header reveal">
        <h2 id="how-heading">{{ data.heading }}</h2>
        <p class="how__sub">{{ data.subheading }}</p>
      </div>

      <div class="how__body">
        <div class="how__image reveal">
          <img :src="data.image" :alt="data.imageAlt" loading="lazy" />
        </div>

        <div class="how__steps">
          <div
            v-for="(step, i) in data.steps"
            :key="i"
            class="how__step reveal"
            :class="`reveal-delay-${i + 1}`"
          >
            <div class="how__step-number" aria-hidden="true">
              {{ step.number }}
            </div>
            <div class="how__step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { howItWorksData as defaultData } from '../../data/auto-accidents'
const props = defineProps({ data: { default: () => defaultData } })
const data = props.data as typeof defaultData
const sectionRef = ref<HTMLElement | null>(null)
useRevealSection(sectionRef)
</script>

<style lang="scss" scoped>
.how {
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
  }

  &__body {
    display: grid;
    grid-template-columns: 587px 1fr;
    gap: 24px;
    align-items: center;

    @include tablet-down {
      grid-template-columns: 1fr;
    }
  }

  &__image {
    border-radius: var(--radius-lg);
    overflow: hidden;
    height: 556px;

    @include tablet-down {
      height: 320px;
    }

    @include mobile {
      height: 240px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__step {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 32px;
    border-radius: var(--radius-lg);
    background: var(--color-white);
  }

  &__step-number {
    font-size: 100px;
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
    font-family: var(--font-primary);
    flex-shrink: 0;
    user-select: none;
    opacity: 0.18;
    min-width: 80px;
    text-align: center;

    @include mobile {
      font-size: 56px;
      min-width: 44px;
    }
  }

  &__step-content {
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-dark);
      margin-bottom: 8px;
      line-height: 1.3;
    }

    p {
      font-size: 16px;
      color: var(--color-muted);
      line-height: 1.65;
      letter-spacing: -0.02em;
    }
  }
}
</style>
