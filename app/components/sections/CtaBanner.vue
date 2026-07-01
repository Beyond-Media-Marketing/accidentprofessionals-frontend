<template>
  <section class="bg-cream" aria-label="Contact call to action">
    <div class="site-container pb-12 md:pb-20">
      <div class="reveal relative flex min-h-[233px] items-center justify-center overflow-hidden rounded-xl px-8 py-11">
        <div
          class="absolute inset-0 bg-[url('/services-page/auto-accidents/black-bg.webp')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div class="relative z-[1] flex max-w-[800px] flex-col items-center gap-4 text-center">
          <p class="font-primary text-[clamp(1.2rem,2.5vw,1.5rem)] font-bold leading-[1.4] text-white">
            <span class="text-accent">{{ data.heading.split("?")[0] }}?</span>
            <span class="font-normal text-white">{{ " " + data.subheading }}</span>
          </p>
          <p class="text-2xl">
            <a
              :href="data.phoneHref"
              class="font-bold tracking-[-0.03em] text-accent transition hover:opacity-[0.85]"
            >{{ data.phone }}</a>
          </p>
          <AppButton tag="button" class="reveal reveal-delay-1" @click="scrollToContact">
            {{ data.cta }}
          </AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollToContact } from "../../composables/useScrollToContact";
const props = defineProps({ data: { type: Object, required: true } });
const data = props.data as any;
const { scrollToContact } = useScrollToContact();
</script>
