<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const { t } = useI18n()
const lh = useLocaleHref()
const { siteUrl } = useRuntimeConfig().public
const slug = 'georgia'
const { loc, def } = await useLocationPage('state', slug)

if (!loc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Location not found', fatal: true })
}

usePageSeo(() => loc.value?.seo, { ogImage: () => strapiMedia(loc.value?.hero?.bgImage) })
useFaqJsonLd(() => (loc.value?.faq?.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })))

const canonical = computed(() => `${siteUrl}${lh(`/${slug}`)}`)
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home'), item: `${siteUrl}${lh('/')}` },
            { '@type': 'ListItem', position: 2, name: loc.value?.title, item: canonical.value },
          ],
        }),
      ),
    },
  ],
})

useScrollReveal()
</script>

<template>
  <LocationSections :loc="loc" :def="def" type="state" />
</template>
