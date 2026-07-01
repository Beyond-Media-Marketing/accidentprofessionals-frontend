<template>
  <section ref="sectionRef" class="bg-cream" aria-labelledby="how-heading">
    <div class="site-container flex flex-col gap-[42px] py-12 md:py-[60px] min-[1200px]:py-20">
      <div class="reveal text-center">
        <h2
          id="how-heading"
          class="mb-4 font-primary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-dark"
        >{{ data.heading }}</h2>
        <p class="text-base leading-[1.75] tracking-[-0.025em] text-muted">{{ data.subheading }}</p>
      </div>

      <div class="grid items-center gap-6 grid-cols-1 min-[1200px]:grid-cols-[587px_1fr]">
        <div class="reveal h-60 overflow-hidden rounded-lg md:h-80 min-[1200px]:h-[556px]">
          <img :src="data.image" :alt="data.imageAlt" loading="lazy" class="h-full w-full object-cover" />
        </div>

        <div class="flex flex-col gap-8">
          <div
            v-for="(step, i) in data.steps"
            :key="i"
            class="reveal flex items-center gap-7 rounded-lg bg-white p-8"
            :class="`reveal-delay-${i + 1}`"
          >
            <div
              aria-hidden="true"
              class="min-w-[44px] shrink-0 select-none text-center font-primary text-[56px] font-bold leading-none text-accent opacity-[0.18] md:min-w-[80px] md:text-[100px]"
            >{{ step.number }}</div>
            <div>
              <h3 class="mb-2 font-primary text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-dark">{{ step.title }}</h3>
              <p class="text-base leading-[1.65] tracking-[-0.02em] text-muted">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({ data: { type: Object, required: true } })
const data = props.data as any
const sectionRef = ref<HTMLElement | null>(null)
useRevealSection(sectionRef)
</script>
