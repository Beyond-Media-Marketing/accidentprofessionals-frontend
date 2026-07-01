<template>
  <section class="cases" ref="sectionRef" aria-labelledby="cases-heading">
    <div class="cases__inner">
      <div class="cases__header reveal">
        <h2 id="cases-heading">{{ data.heading }}</h2>
        <p class="cases__sub">{{ data.subheading }}</p>
      </div>

      <div class="cases__grid">
        <div
          v-for="(c, i) in data.cases"
          :key="i"
          class="cases__card reveal"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="cases__card-icon" aria-hidden="true">
            <img :src="c.icon" :alt="c.title" width="60" height="60" loading="lazy" />
          </div>
          <div class="cases__card-body">
            <h3 class="cases__card-title">{{ c.title }}</h3>
            <p class="cases__card-desc">{{ c.description }}</p>
          </div>
        </div>
      </div>

      <div class="cases__cta reveal">
        <AppButton tag="button" @click="scrollToContact">
          {{ data.cta }}
          <img src="/services-page/auto-accidents/arrow-black.svg" alt="" width="18" height="18" />
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollToContact } from '../../composables/useScrollToContact'
const props = defineProps({ data: { type: Object, required: true } })
const data = props.data as any
const { scrollToContact } = useScrollToContact()
const sectionRef = ref<HTMLElement | null>(null)
useRevealSection(sectionRef)
</script>

<style lang="scss" scoped>
.cases {
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

    h2 {
      font-size: clamp(1.8rem, 3.5vw, 3.125rem);
      color: var(--color-dark);
      margin-bottom: 16px;
    }
  }

  &__sub {
    font-size: 16px;
    color: var(--color-muted);
    letter-spacing: -0.025em;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    width: 100%;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: var(--color-cream);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 24px;
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  &__card-icon {
    flex-shrink: 0;

    img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      display: block;
    }
  }

  &__card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__card-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-dark);
    line-height: 1.3;
  }

  &__card-desc {
    font-size: 16px;
    color: var(--color-muted);
    line-height: 1.65;
    letter-spacing: -0.02em;
  }

  &__cta {
    display: flex;
    justify-content: center;
  }
}
</style>
