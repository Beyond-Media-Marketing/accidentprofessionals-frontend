<script setup lang="ts">
/**
 * <NuxtLink> that keeps internal links in the visitor's language — `/services`
 * renders as `/es/services` on the Spanish site. Use it for every in-site link;
 * external, tel:, mailto: and #anchor links pass through unchanged.
 */
const props = defineProps<{ to?: string | null }>()
const lh = useLocaleHref()
</script>

<template>
  <NuxtLink :to="lh(props.to) || undefined"><slot /></NuxtLink>
</template>
