<script setup lang="ts">
import { computed } from 'vue'

interface Cta { label?: string | null; href?: string | null; variant?: string | null }
interface Block {
  heading?: string | null
  text?: string | null // HTML (CKEditor)
  cta?: Cta | null
}
const props = defineProps<{ block: Block | null | undefined; dark?: boolean }>()

// Rich CTAs (bullet lists, several paragraphs, or a lot of copy) read better with
// the button stacked *below* the text; short one-liners keep the button inline.
const isRich = computed(() => {
  const html = props.block?.text || ''
  const plain = html.replace(/<[^>]+>/g, '').trim()
  return (
    /<(ul|ol|h[1-6]|blockquote)\b/i.test(html) ||
    (html.match(/<p\b/gi)?.length ?? 0) > 1 ||
    plain.length > 160
  )
})
</script>

<template>
  <div
    v-if="block && (block.heading || block.text || block.cta?.label)"
    class="my-10 overflow-hidden rounded-3xl px-7 py-9 sm:px-10 3xl:my-12"
    :class="dark ? 'bg-dark text-on-dark' : 'border border-accent/25 bg-accent/[0.08]'"
  >
    <div
      :class="isRich
        ? 'flex flex-col items-start gap-6'
        : 'flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8'"
    >
      <div :class="isRich ? 'w-full' : ''">
        <h3
          v-if="block.heading"
          class="font-secondary text-xl font-bold leading-snug 3xl:text-2xl"
          :class="dark ? 'text-white' : 'text-dark'"
        >{{ block.heading }}</h3>
        <div
          v-if="block.text"
          class="cta-rich mt-2 font-primary text-sm leading-relaxed"
          :class="dark ? 'text-white/75' : 'text-dark/75'"
          v-html="block.text"
        />
      </div>

      <BaseButton
        v-if="block.cta?.label"
        :class="isRich ? '' : 'shrink-0'"
        :href="block.cta.href"
        :variant="block.cta.variant || 'primary'"
      >
        {{ block.cta.label }}
        <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
/* Inherit the surrounding text colour so it works on both the light and dark variants. */
.cta-rich :deep(p) { margin: 0 0 0.7em; }
.cta-rich :deep(p:last-child) { margin-bottom: 0; }
.cta-rich :deep(a) { color: var(--color-accent); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
.cta-rich :deep(strong), .cta-rich :deep(b) { font-weight: 700; }
.cta-rich :deep(h3), .cta-rich :deep(h4) { font-family: var(--font-secondary); font-weight: 700; font-size: 1.05rem; margin: 0.8em 0 0.35em; }
.cta-rich :deep(ul), .cta-rich :deep(ol) { margin: 0.6em 0; display: flex; flex-direction: column; gap: 0.4em; }
.cta-rich :deep(ul) { list-style: none; padding-left: 0; }
.cta-rich :deep(ul > li) { position: relative; padding-left: 1.5em; }
.cta-rich :deep(ul > li)::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent); }
.cta-rich :deep(ol) { list-style: decimal; padding-left: 1.3em; }
.cta-rich :deep(li) { line-height: 1.6; }
</style>
