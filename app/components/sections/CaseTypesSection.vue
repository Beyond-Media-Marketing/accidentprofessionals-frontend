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
          :class="[`reveal-delay-${i + 1}`, c.hasPage ? 'relative cursor-pointer transition-colors hover:border-accent/40' : '']"
        >
          <div class="shrink-0" aria-hidden="true">
            <img :src="c.icon" :alt="c.title" width="60" height="60" loading="lazy" class="block h-[60px] w-[60px] object-contain" />
          </div>
          <div class="flex flex-1 flex-col gap-2">
            <h3 class="font-primary text-2xl font-semibold leading-[1.3] tracking-[-0.02em] text-dark">{{ c.title }}</h3>
            <p class="text-base leading-[1.65] tracking-[-0.02em] text-muted">{{ c.description }}</p>
            <!-- Per-card CTA — only for sub-services with a built page. Its stretched
                 ::after makes the whole card clickable. -->
            <NuxtLink
              v-if="c.hasPage"
              :to="c.linkAnchor ? `${c.link}#${c.linkAnchor}` : c.link"
              class="mt-2 inline-flex w-fit items-center gap-1.5 font-primary text-[15px] font-semibold text-accent transition-opacity hover:opacity-80 after:absolute after:inset-0 after:content-['']"
            >
              Read More
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </NuxtLink>
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
