<template>
  <section ref="sectionRef" class="bg-white" aria-labelledby="cases-heading">
    <div class="site-container flex flex-col items-center gap-[42px] py-12 md:py-[60px] min-[1200px]:py-20">
      <div class="reveal text-center">
        <h2
          id="cases-heading"
          class="mb-4 font-primary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-dark"
        >{{ data.heading }}</h2>
        <p class="text-base leading-[1.65] tracking-[-0.025em] text-muted">{{ data.subheading }}</p>
      </div>

      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div
          v-for="(c, i) in data.cases"
          :key="i"
          class="reveal flex items-start gap-6 rounded-lg border border-border-subtle bg-cream p-6"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="shrink-0" aria-hidden="true">
            <img :src="c.icon" :alt="c.title" width="60" height="60" loading="lazy" class="block h-[60px] w-[60px] object-contain" />
          </div>
          <div class="flex flex-1 flex-col gap-2">
            <h3 class="font-primary text-2xl font-semibold leading-[1.3] tracking-[-0.02em] text-dark">{{ c.title }}</h3>
            <p class="text-base leading-[1.65] tracking-[-0.02em] text-muted">{{ c.description }}</p>
          </div>
        </div>
      </div>

      <div class="reveal flex justify-center">
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
