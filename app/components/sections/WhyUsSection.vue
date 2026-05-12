<template>
  <section class="why" ref="sectionRef" aria-labelledby="why-heading">
    <div class="why__bg" aria-hidden="true" />

    <div class="why__inner">
      <!-- Centered header -->
      <div class="why__header reveal">
        <h2 id="why-heading" class="why__heading">
          {{ data.heading.replace(data.headingAccent, "") }}
          <span class="text-accent">{{ data.headingAccent }}</span>
        </h2>
        <p class="why__sub">{{ data.body1 }}</p>
      </div>

      <!-- Two-column body -->
      <div class="why__body">
        <div class="why__left reveal reveal-delay-1">
          <p class="why__lead">
            <span class="text-accent">Accident Professionals con</span>nects you
            with an auto accident attorney in Georgia before you say anything
            that could be used against you. That changes everything.
          </p>
          <p class="why__caption">{{ data.body3 }}</p>
        </div>

        <div class="why__right">
          <div
            v-for="(row, r) in [
              [0, 1],
              [2, 3],
            ]"
            :key="r"
            class="why__row"
          >
            <button
              v-for="i in row"
              :key="i"
              class="why__feature"
              :class="{ 'is-open': open.has(i) }"
              @click="toggle(i)"
              :aria-expanded="open.has(i)"
            >
              <div class="why__feature-icon">
                <img
                  :src="
                    open.has(i)
                      ? data.features[i].iconGrey
                      : data.features[i].iconYellow
                  "
                  :alt="data.features[i].title"
                  width="64"
                  height="64"
                  loading="lazy"
                />
              </div>
              <div class="why__feature-text">
                <p class="why__feature-title">{{ data.features[i].title }}</p>
                <p class="why__feature-desc">
                  {{ data.features[i].description }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { whyUsData as defaultData } from "../../data/home";

const props = defineProps({ data: { default: () => defaultData } });
const data = props.data as typeof defaultData;
const sectionRef = ref<HTMLElement | null>(null);
useRevealSection(sectionRef);

const open = ref<Set<number>>(new Set([1, 2]));

// Each row is a pair: [0,1] and [2,3]. Opening one always closes its partner.
function toggle(i: number) {
  const partner = i % 2 === 0 ? i + 1 : i - 1;
  const next = new Set(open.value);
  if (next.has(i)) {
    next.delete(i);
    next.add(partner);
  } else {
    next.add(i);
    next.delete(partner);
  }
  open.value = next;
  // restart auto-cycle so it doesn't cut short a manual interaction
  restartTimer();
}

let timer: ReturnType<typeof setInterval>;

function startTimer() {
  timer = setInterval(() => {
    open.value = open.value.has(1) ? new Set([0, 3]) : new Set([1, 2]);
  }, 5000);
}

function restartTimer() {
  clearInterval(timer);
  startTimer();
}

onMounted(startTimer);
onUnmounted(() => clearInterval(timer));
</script>

<style lang="scss" scoped>
// Closed card is a square — this value drives the row height
$closed: 140px;
$icon: 64px;
$gap: 16px;
$pad: 20px;

.why {
  position: relative;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url("/services-page/auto-accidents/black-bg.png");
    background-size: cover;
    background-position: center;
  }

  &__inner {
    @include container;
    @include section-padding;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  &__header {
    text-align: center;
    max-width: 780px;
    margin-inline: auto;
  }

  &__heading {
    font-size: clamp(1.8rem, 3vw, 3.125rem);
    font-weight: 700;
    color: var(--color-white);
    line-height: 1.15;
    margin-bottom: 20px;
  }

  &__sub {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.57);
    line-height: 1.75;
    letter-spacing: -0.025em;
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;

    @include tablet-down {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__lead {
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    font-weight: 700;
    color: #a8a197;
    line-height: 1.35;
    letter-spacing: -0.02em;
  }

  &__caption {
    font-size: 15px;
    color: white;
    line-height: 1.75;
    letter-spacing: -0.025em;
  }

  // ── Feature grid ─────────────────────────────────────────────────────────

  &__right {
    display: flex;
    flex-direction: column;
    gap: $gap;
  }

  &__row {
    display: flex;
    gap: $gap;
    height: $closed; // fixed row height = closed card's square size
  }

  &__feature {
    // Closed: square (1:1)
    flex: none;
    width: $closed;
    height: $closed;
    overflow: hidden;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: $gap;

    // Center icon horizontally inside the square
    padding: $pad;
    padding-left: ($closed - $icon) * 0.5;

    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;

    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
      padding-left 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.18);
    }

    // Open: wide, icon left-padded normally
    &.is-open {
      width: calc(100% - #{$closed} - #{$gap});
      padding-left: $pad;
      border-color: rgba(255, 255, 255, 0.14);
    }
  }

  &__feature-icon {
    flex-shrink: 0;

    img {
      display: block;
      width: $icon;
      height: $icon;
      object-fit: contain;
    }
  }

  // Text slides in as card widens
  &__feature-text {
    overflow: hidden;
    opacity: 0;
    max-width: 0;
    flex-shrink: 0;
    transition: max-width 0.45s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s ease 0.18s;

    .why__feature.is-open & {
      max-width: 280px;
      opacity: 1;
    }
  }

  &__feature-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-white);
    line-height: 1.4;
    white-space: nowrap;
    margin-bottom: 5px;
  }

  &__feature-desc {
    font-size: 14px;
    color: white;
    line-height: 1.5;
    white-space: nowrap;
  }

  // ── Mobile: static 2×2 grid, no animation ─────────────────────────────────
  @include mobile {
    &__right {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    &__row {
      display: contents;
    }

    &__feature {
      width: 100% !important;
      height: auto !important;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px !important;
      gap: 12px;
      transition: none;

      &.is-open {
        width: 100% !important;
        padding-left: 20px !important;
      }
    }

    &__feature-icon img {
      width: 40px;
      height: 40px;
    }

    &__feature-text {
      max-width: none !important;
      opacity: 1 !important;
      transition: none;
      overflow: visible;
    }

    &__feature-title {
      white-space: normal;
      font-size: 14px;
    }

    &__feature-desc {
      white-space: normal;
      font-size: 13px;
    }
  }
}
</style>
