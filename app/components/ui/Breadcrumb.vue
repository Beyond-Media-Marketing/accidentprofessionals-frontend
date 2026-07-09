<script setup lang="ts">
import { computed } from 'vue'

interface Crumb {
  label?: string | null
  to?: string | null
}

const props = withDefaults(
  defineProps<{ items: Crumb[]; variant?: 'light' | 'onDark' }>(),
  { variant: 'light' },
)

// Drop empty items (e.g. a name that hasn't resolved yet).
const crumbs = computed(() => (props.items || []).filter((c) => c?.label))
</script>

<template>
  <nav
    v-if="crumbs.length"
    aria-label="Breadcrumb"
    class="font-primary text-sm"
    :class="variant === 'onDark' ? 'text-white/55' : 'text-dark/45'"
  >
    <ol class="flex flex-wrap items-center">
      <li v-for="(c, i) in crumbs" :key="i" class="flex items-center">
        <NuxtLink
          v-if="c.to && i < crumbs.length - 1"
          :to="c.to"
          class="transition-colors hover:text-accent"
        >{{ c.label }}</NuxtLink>
        <span v-else :class="variant === 'onDark' ? 'text-white/90' : 'text-dark/70'">{{ c.label }}</span>
        <span v-if="i < crumbs.length - 1" class="px-2 opacity-50" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
