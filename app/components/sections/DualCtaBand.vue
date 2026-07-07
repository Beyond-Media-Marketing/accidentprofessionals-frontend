<script setup lang="ts">
interface Cta { label?: string | null; href?: string | null; variant?: string | null }
interface Block {
  heading?: string | null
  headingAccent?: string | null
  leftText?: string | null
  rightText?: string | null
  primaryCta?: Cta | null
  secondaryCta?: Cta | null
}

defineProps<{ block: Block | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section bg-dark text-on-dark">
    <div class="site-container">
      <div class="mx-auto max-w-[900px] text-center">
        <h2 class="font-secondary text-[clamp(1.9rem,4vw,3.25rem)] font-bold leading-[1.15]">
          <span v-if="block.heading" class="text-white">{{ block.heading }}</span>
          <span v-if="block.headingAccent" class="text-accent"> {{ block.headingAccent }}</span>
        </h2>
      </div>

      <div class="mx-auto mt-10 grid max-w-[820px] gap-6 sm:grid-cols-2">
        <p v-if="block.leftText" class="border-l-2 border-accent pl-5 font-primary text-[15px] leading-[1.7] text-white/65">{{ block.leftText }}</p>
        <p v-if="block.rightText" class="border-l-2 border-accent pl-5 font-primary text-[15px] leading-[1.7] text-white/65">{{ block.rightText }}</p>
      </div>

      <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <BaseButton v-if="block.primaryCta?.label" :href="block.primaryCta.href" :variant="block.primaryCta.variant || 'primary'">
          {{ block.primaryCta.label }}
          <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
        </BaseButton>
        <BaseButton v-if="block.secondaryCta?.label" :href="block.secondaryCta.href" :variant="block.secondaryCta.variant || 'ghost'">
          {{ block.secondaryCta.label }}
          <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>
