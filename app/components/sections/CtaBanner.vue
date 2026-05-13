<template>
  <section class="cta" aria-label="Contact call to action">
    <div class="cta__inner">
      <div class="cta__card reveal">
        <div class="cta__bg" aria-hidden="true" />
        <div class="cta__content">
          <p class="cta__heading">
            <span class="text-accent">{{ data.heading.split("?")[0] }}?</span>
            <span class="cta__heading-rest">{{ " " + data.subheading }}</span>
          </p>
          <p class="cta__sub">
            <a :href="data.phoneHref" class="cta__phone">{{ data.phone }}</a>
          </p>
          <AppButton
            tag="a"
            :href="data.phoneHref"
            class="reveal reveal-delay-1"
          >
            {{ data.cta }}
          </AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ctaBannerData as defaultData } from "../../data/auto-accidents";
const props = defineProps({ data: { default: () => defaultData } });
const data = props.data as typeof defaultData;
</script>

<style lang="scss" scoped>
.cta {
  background: var(--color-cream);
  padding-bottom: 0;

  &__inner {
    @include container;
    padding-bottom: 80px;

    @include mobile {
      padding-bottom: 48px;
    }
  }

  &__card {
    position: relative;
    border-radius: var(--radius-xl);
    overflow: hidden;
    padding: 44px 32px;
    min-height: 233px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url("/services-page/auto-accidents/black-bg.webp");
    background-size: cover;
    background-position: center;
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 800px;
  }

  &__heading {
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    font-weight: 700;
    font-family: var(--font-primary);
    line-height: 1.4;
    color: var(--color-white);
  }

  &__heading-rest {
    font-weight: 400;
    color: var(--color-white);
  }

  &__sub {
    font-size: 24px;
  }

  &__phone {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-accent);
    letter-spacing: -0.03em;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
