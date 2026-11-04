<script setup lang="ts">
/**
 * EN | ES toggle — links to the current page in the other language (slugs are
 * shared, so /services/x ⇄ /es/services/x). Plain NuxtLink on purpose: the
 * target path is already localized, so AppLink would prefix it a second time.
 */
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center rounded-pill border border-dark/10 bg-cream p-0.5 font-primary font-semibold"
    :class="size === 'sm' ? 'text-[11px]' : 'text-xs'"
    role="group"
    :aria-label="t('lang.switch')"
  >
    <NuxtLink
      v-for="l in locales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      :hreflang="l.language"
      :lang="l.language"
      :title="l.name"
      :aria-current="l.code === locale ? 'true' : undefined"
      class="rounded-pill uppercase tracking-wide transition-colors"
      :class="[
        size === 'sm' ? 'px-2 py-1' : 'px-2.5 py-1.5',
        l.code === locale ? 'bg-dark text-white' : 'text-dark/60 hover:text-dark',
      ]"
    >
      {{ l.code }}
    </NuxtLink>
  </div>
</template>
