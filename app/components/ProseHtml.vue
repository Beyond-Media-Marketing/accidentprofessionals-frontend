<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ html?: string | null }>()
// Ensure every <h2> has an id so the table-of-contents anchors resolve.
const rendered = computed(() => addHeadingIds(props.html))
</script>

<template>
  <div class="prose-blocks" v-html="rendered" />
</template>

<style scoped>
/* flow-root establishes a block-formatting context so floated images stay
   contained within the article body (they never wrap the following CTA/section). */
.prose-blocks { font-family: var(--font-primary); color: var(--color-dark); font-size: 17px; line-height: 1.8; display: flow-root; }
.prose-blocks :deep(h2) { font-family: var(--font-secondary); font-weight: 700; font-size: clamp(1.4rem, 2.4vw, 1.9rem); line-height: 1.25; color: var(--color-dark); margin: 2.2em 0 0.7em; scroll-margin-top: 100px; }
.prose-blocks :deep(h3) { font-family: var(--font-secondary); font-weight: 700; font-size: clamp(1.2rem, 2vw, 1.45rem); color: var(--color-dark); margin: 1.8em 0 0.6em; scroll-margin-top: 100px; }
.prose-blocks :deep(h4) { font-family: var(--font-secondary); font-weight: 700; font-size: 1.15rem; color: var(--color-dark); margin: 1.6em 0 0.5em; }
.prose-blocks :deep(h2:first-child), .prose-blocks :deep(h3:first-child) { margin-top: 0; }
.prose-blocks :deep(p) { margin: 0 0 1.25em; }
.prose-blocks :deep(a) { color: var(--color-accent); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
.prose-blocks :deep(ul), .prose-blocks :deep(ol) { margin: 0 0 1.4em; padding-left: 1.3em; display: flex; flex-direction: column; gap: 0.5em; }
.prose-blocks :deep(ul) { list-style: none; padding-left: 0; }
.prose-blocks :deep(ul > li) { position: relative; padding-left: 1.9em; }
.prose-blocks :deep(ul > li)::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); }
.prose-blocks :deep(ol) { list-style: decimal; }
.prose-blocks :deep(li) { line-height: 1.7; }
.prose-blocks :deep(strong), .prose-blocks :deep(b) { font-weight: 700; color: var(--color-dark); }
.prose-blocks :deep(blockquote) { margin: 1.6em 0; padding: 0.4em 0 0.4em 1.4em; border-left: 3px solid var(--color-accent); font-size: 1.15em; font-style: italic; }
.prose-blocks :deep(img) { display: block; width: 100%; height: auto; border-radius: 16px; margin: 1.8em 0; }

/* CKEditor image figures (block-level, may carry an inline width from resizing). */
.prose-blocks :deep(figure.image) { margin: 1.8em 0; }
.prose-blocks :deep(figure.image img) { width: 100%; margin: 0; }
.prose-blocks :deep(figure.image figcaption) { margin-top: 0.6em; font-size: 0.82em; line-height: 1.5; color: var(--color-muted); text-align: center; }

/* Float right — "side image", right / block-right alignment. */
.prose-blocks :deep(figure.image-style-side),
.prose-blocks :deep(figure.image-style-align-right),
.prose-blocks :deep(figure.image-style-block-align-right) {
  float: right;
  max-width: 50%;
  margin: 0.4em 0 1.2em 1.8em;
}
/* Float left. */
.prose-blocks :deep(figure.image-style-align-left),
.prose-blocks :deep(figure.image-style-block-align-left) {
  float: left;
  max-width: 50%;
  margin: 0.4em 1.8em 1.2em 0;
}
/* Centered. */
.prose-blocks :deep(figure.image-style-align-center),
.prose-blocks :deep(figure.image-style-block-align-center) {
  margin-left: auto;
  margin-right: auto;
}

/* On phones a floated 50% image is too cramped — let it go full width. */
@media (max-width: 640px) {
  .prose-blocks :deep(figure.image-style-side),
  .prose-blocks :deep(figure.image-style-align-right),
  .prose-blocks :deep(figure.image-style-block-align-right),
  .prose-blocks :deep(figure.image-style-align-left),
  .prose-blocks :deep(figure.image-style-block-align-left) {
    float: none;
    max-width: 100%;
    margin: 1.5em 0;
  }
}
</style>
