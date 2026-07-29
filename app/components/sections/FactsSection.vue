<script setup lang="ts">
import { computed } from 'vue'

interface Stat {
  value?: string | null
  label?: string | null
}
interface Facts {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  intro?: string | null
  image?: string | null
  body?: string | null
  stats?: Stat[] | null
}
const props = defineProps<{ block: Facts | null | undefined }>()

// Split richtext body into paragraphs (bold/links via renderInlineMarkdown).
const paragraphs = computed(() =>
  (props.block?.body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean),
)
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-14 3xl:gap-20">
        <!-- Left: header + image -->
        <div class="flex flex-col gap-8">
          <div>
            <h2
              class="mt-5 font-secondary text-3xl font-bold leading-tight text-dark sm:text-4xl 3xl:text-5xl"
              v-html="renderInlineMarkdown(block.heading)"
            />
            <p v-if="block.intro" class="mt-4 max-w-xl font-primary text-base leading-relaxed text-muted">
              {{ block.intro }}
            </p>
          </div>

          <div v-if="strapiMedia(block.image)" class="overflow-hidden rounded-3xl">
            <img :src="strapiMedia(block.image)" alt="" class="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
        </div>

        <!-- Right: stat cards + body -->
        <div class="flex flex-col gap-8">
          <div v-if="block.stats?.length" class="grid grid-cols-2 gap-4">
            <div
              v-for="(stat, i) in block.stats"
              :key="i"
              class="flex flex-col justify-center rounded-2xl bg-[#f4f0e6] px-7 py-8 text-center"
            >
              <p class="font-secondary text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none text-dark">{{ stat.value }}</p>
              <p class="mt-2 font-primary text-sm text-muted">{{ stat.label }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <p
              v-for="(p, i) in paragraphs"
              :key="i"
              class="font-primary text-[15px] leading-relaxed text-muted [&_strong]:font-semibold [&_strong]:text-dark"
              v-html="renderInlineMarkdown(p)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Gold accent for **bold** in the heading (renderInlineMarkdown emits <strong>). */
:deep(h2 strong) {
  color: var(--color-accent);
  font-weight: inherit;
}
</style>
