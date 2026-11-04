<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const route = useRoute()
const { t } = useI18n()
const lh = useLocaleHref()
const { siteUrl } = useRuntimeConfig().public
const slug = String(route.params.city)
const { loc, def, cities } = await useLocationPage('city', slug)

if (!loc.value) {
  throw createError({ statusCode: 404, statusMessage: 'City not found', fatal: true })
}

usePageSeo(() => loc.value?.seo, { ogImage: () => strapiMedia(loc.value?.hero?.bgImage) })
useFaqJsonLd(() => (loc.value?.faq?.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })))

const canonical = computed(() => `${siteUrl}${lh(`/georgia/${slug}`)}`)
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
            { '@type': 'ListItem', position: 2, name: t('nav.georgia'), item: `${siteUrl}${lh('/georgia')}` },
            { '@type': 'ListItem', position: 3, name: loc.value?.title, item: canonical.value },
          ],
        }),
      ),
    },
  ],
})

useScrollReveal()
</script>

<template>
  <LocationSections :loc="loc" :def="def" type="city" :all-cities="cities" />
</template>
