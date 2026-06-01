<script setup lang="ts">
/**
 * Reusable CTA button driven by a Strapi `shared.cta` object (or explicit props).
 * Renders a NuxtLink (internal), <a> (external / anchor), or <button> (scrollTo).
 */
const props = withDefaults(
  defineProps<{
    label?: string | null
    href?: string | null
    variant?: 'primary' | 'dark' | 'ghost' | null
    external?: boolean | null
    /** id of an element to smooth-scroll to instead of navigating */
    scrollTo?: string | null
  }>(),
  { variant: 'primary' },
)

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill px-6 text-[15px] font-semibold transition-all h-[52px] 3xl:h-[56px]'

const variants: Record<string, string> = {
  primary: 'bg-accent text-dark hover:-translate-y-px hover:shadow-button',
  dark: 'bg-dark text-on-dark hover:-translate-y-px hover:shadow-button',
  ghost: 'border border-white/30 text-white hover:bg-white/10',
}

const classes = computed(() => `${base} ${variants[props.variant || 'primary']}`)

function onScroll(e: Event) {
  if (!props.scrollTo || !import.meta.client) return
  const el = document.getElementById(props.scrollTo)
  if (el) {
    e.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<template>
  <button v-if="scrollTo" type="button" :class="classes" @click="onScroll">
    <slot>{{ label }}</slot>
  </button>
  <a v-else-if="external" :href="href || '#'" target="_blank" rel="noopener" :class="classes">
    <slot>{{ label }}</slot>
  </a>
  <NuxtLink v-else :to="href || '#'" :class="classes">
    <slot>{{ label }}</slot>
  </NuxtLink>
</template>
