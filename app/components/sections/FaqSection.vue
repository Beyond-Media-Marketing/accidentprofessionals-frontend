<template>
  <section class="faq" ref="sectionRef" aria-labelledby="faq-heading">
    <div class="faq__inner">
      <div class="faq__header reveal">
        <h2 id="faq-heading">{{ data.heading }}</h2>
        <p class="faq__sub">{{ data.subheading }}</p>
      </div>

      <div class="faq__list" role="list">
        <div
          v-for="(item, i) in data.items"
          :key="i"
          class="faq__item reveal"
          :class="[`reveal-delay-${i % 3 + 1}`, { 'is-open': openIndex === i, 'is-visible': sectionVisible }]"
          role="listitem"
        >
          <button
            class="faq__question"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-answer-${i}`"
            :id="`faq-question-${i}`"
            @click="toggle(i)"
          >
            <span :class="{ 'faq__question-text--active': openIndex === i }">{{ item.question }}</span>
            <span class="faq__icon" aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          <div
            :id="`faq-answer-${i}`"
            :aria-labelledby="`faq-question-${i}`"
            class="faq__answer"
            :style="{ maxHeight: openIndex === i ? answerHeights[i] + 'px' : '0' }"
          >
            <p ref="answerRefs" class="faq__answer-text" :data-index="i">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { faqData as defaultData } from '../../data/home'

const props = defineProps({ data: { default: () => defaultData } })
const data = props.data as typeof defaultData
const sectionRef = ref<HTMLElement | null>(null)
const openIndex = ref<number | null>(0)
const answerRefs = ref<HTMLElement[]>([])
const answerHeights = ref<number[]>(data.items.map(() => 0))
const sectionVisible = ref(false)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

onMounted(() => {
  nextTick(() => {
    answerRefs.value.forEach((el) => {
      if (!el) return
      const idx = parseInt(el.dataset.index ?? '0')
      answerHeights.value[idx] = el.scrollHeight + 32
    })
  })

  if (sectionRef.value) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        sectionVisible.value = true
        obs.disconnect()
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    obs.observe(sectionRef.value)
  }
})

useRevealSection(sectionRef)
</script>

<style lang="scss" scoped>
.faq {
  background: var(--color-cream);

  &__inner {
    @include container;
    @include section-padding;
    display: flex;
    flex-direction: column;
    gap: 42px;
    max-width: 1036px;
  }

  &__header {
    text-align: center;

    h2 {
      font-size: clamp(1.8rem, 3.5vw, 3.125rem);
      color: var(--color-dark);
      margin-bottom: 8px;
    }
  }

  &__sub {
    font-size: 16px;
    color: var(--color-muted);
    line-height: 1.875;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__item {
    background: var(--color-white);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  &__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 24px 32px;
    text-align: left;
    font-size: 18px;
    font-weight: 600;
    font-family: var(--font-primary);
    color: var(--color-dark);
    cursor: pointer;
    transition: color var(--transition-base);

    &:hover { color: var(--color-accent); }

    .faq__question-text--active { color: var(--color-accent); }
  }

  &__icon {
    flex-shrink: 0;
    display: flex;
    color: var(--color-dark);
  }

  &__answer {
    overflow: hidden;
    transition: max-height 0.35s ease;
  }

  &__answer-text {
    padding: 0 32px 32px;
    font-size: 16px;
    color: var(--color-muted);
    line-height: 1.875;
  }
}
</style>
