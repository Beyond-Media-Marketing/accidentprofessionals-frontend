<template>
  <section ref="sectionRef" class="bg-white" aria-labelledby="steps-heading">
    <div class="site-container flex flex-col items-center gap-[42px] py-12 md:py-[60px] min-[1200px]:py-20">
      <div class="reveal max-w-[876px] text-center">
        <h2
          id="steps-heading"
          class="mb-4 font-primary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-dark"
        >{{ data.heading }}</h2>
        <p class="text-base leading-[1.75] tracking-[-0.025em] text-muted">{{ data.subheading }}</p>
      </div>

      <div class="steps__grid">
        <article
          v-for="(step, i) in data.steps"
          :key="i"
          class="reveal relative flex flex-col overflow-hidden rounded-md bg-cream p-8"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="relative z-[1]">
            <h3 class="mb-2 font-primary text-lg font-semibold leading-[1.55] tracking-[-0.02em] text-dark">{{ step.title }}</h3>
            <p class="text-sm leading-[1.43] tracking-[-0.01em] text-dark opacity-80">{{ step.description }}</p>
          </div>
        </article>
      </div>

      <div class="reveal mt-2 flex justify-center">
        <AppButton tag="button" @click="scrollToContact">
          {{ data.cta }}
          <img src="/services-page/auto-accidents/arrow-black.svg" alt="" width="18" height="18" />
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollToContact } from "../../composables/useScrollToContact";
const props = defineProps({ data: { type: Object, required: true } });
const data = props.data as any;
const { scrollToContact } = useScrollToContact();
const sectionRef = ref<HTMLElement | null>(null);
useRevealSection(sectionRef);
</script>

<!-- Plain CSS (no SCSS): the 6-column bento placement + outlined (text-stroke) number. -->
<style scoped>
.steps__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  width: 100%;
}
.steps__grid > :nth-child(1) { grid-column: 1 / 3; }
.steps__grid > :nth-child(2) { grid-column: 3 / 5; }
.steps__grid > :nth-child(3) { grid-column: 5 / 7; }
.steps__grid > :nth-child(4) { grid-column: 2 / 4; }
.steps__grid > :nth-child(5) { grid-column: 4 / 6; }

@media (min-width: 768px) and (max-width: 1199px) {
  .steps__grid { grid-template-columns: repeat(2, 1fr); }
  .steps__grid > :nth-child(1),
  .steps__grid > :nth-child(2),
  .steps__grid > :nth-child(3),
  .steps__grid > :nth-child(4),
  .steps__grid > :nth-child(5) { grid-column: auto; }
}
@media (max-width: 767px) {
  .steps__grid { grid-template-columns: 1fr; }
  .steps__grid > :nth-child(1),
  .steps__grid > :nth-child(2),
  .steps__grid > :nth-child(3),
  .steps__grid > :nth-child(4),
  .steps__grid > :nth-child(5) { grid-column: auto; }
}

</style>
