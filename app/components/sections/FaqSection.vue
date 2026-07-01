<template>
  <section class="bg-cream" ref="sectionRef" aria-labelledby="faq-heading">
    <div class="site-container flex max-w-[1036px] flex-col gap-[42px] py-12 md:py-[60px] min-[1200px]:py-20">
      <div class="reveal text-center">
        <h2
          id="faq-heading"
          class="mb-2 font-primary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-dark"
        >{{ data.heading }}</h2>
        <p class="text-base leading-[1.875] text-muted">{{ data.subheading }}</p>
      </div>

      <div class="flex flex-col gap-[15px]" role="list">
        <div
          v-for="(item, i) in data.items"
          :key="i"
          class="reveal overflow-hidden rounded-md bg-white"
          :class="[`reveal-delay-${i % 3 + 1}`, { 'is-visible': sectionVisible }]"
          role="listitem"
        >
          <button
            class="flex w-full items-center justify-between gap-4 px-8 py-6 text-left font-primary text-lg font-semibold text-dark transition-colors duration-[250ms] hover:text-accent"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-answer-${i}`"
            :id="`faq-question-${i}`"
            @click="toggle(i)"
          >
            <span :class="openIndex === i ? 'text-accent' : ''">{{ item.question }}</span>
            <span class="flex shrink-0 text-dark" aria-hidden="true">
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
            class="overflow-hidden transition-[max-height] duration-[350ms] ease"
            :style="{ maxHeight: openIndex === i ? answerHeights[i] + 'px' : '0' }"
          >
            <p ref="answerRefs" class="px-8 pb-8 text-base leading-[1.875] text-muted" :data-index="i">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({ data: { type: Object, required: true } })
const data = props.data as any
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
