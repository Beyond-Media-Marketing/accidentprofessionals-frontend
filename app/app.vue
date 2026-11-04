<script setup lang="ts">
// Fetch sitewide globals (settings/nav/footer) for the current language, then
// emit the sitewide organization JSON-LD. Both are no-ops/empty if the CMS is
// unreachable. Switching language fetches the other locale's globals once.
const { locale } = useI18n()
await fetchGlobals(locale.value)
watch(locale, (next) => fetchGlobals(next))
useOrganizationJsonLd()

// <html lang>, hreflang alternates (en-US / es-US / x-default) and og:locale.
// Canonical + og:url are left to usePageSeo, which honours CMS overrides.
const i18nHead = useLocaleHead({ seo: true })
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang },
  link: (i18nHead.value.link ?? []).filter((l: any) => l.rel !== 'canonical'),
  meta: (i18nHead.value.meta ?? []).filter((m: any) => m.property !== 'og:url'),
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
