<script setup lang="ts">
interface Cta { label?: string | null; href?: string | null; variant?: string | null }
interface Block {
  heading?: string | null
  text?: string | null
  cta?: Cta | null
}
defineProps<{ block: Block | null | undefined; dark?: boolean }>()
</script>

<template>
  <div
    v-if="block && (block.heading || block.text || block.cta?.label)"
    class="my-10 overflow-hidden rounded-3xl px-7 py-9 sm:px-10 3xl:my-12"
    :class="dark
      ? 'bg-dark text-on-dark'
      : 'border border-accent/25 bg-accent/[0.08]'"
  >
    <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div>
        <h3
          v-if="block.heading"
          class="font-secondary text-xl font-bold leading-snug 3xl:text-2xl"
          :class="dark ? 'text-white' : 'text-dark'"
        >{{ block.heading }}</h3>
        <p
          v-if="block.text"
          class="mt-2 font-primary text-sm leading-relaxed"
          :class="dark ? 'text-white/70' : 'text-dark/70'"
        >{{ block.text }}</p>
      </div>
      <BaseButton
        v-if="block.cta?.label"
        class="shrink-0"
        :href="block.cta.href"
        :variant="block.cta.variant || 'primary'"
      >
        {{ block.cta.label }}
        <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
      </BaseButton>
    </div>
  </div>
</template>
