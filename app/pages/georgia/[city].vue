<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const route = useRoute()
const slug = String(route.params.city)
const { loc, def } = await useLocationPage('city', slug)

if (!loc.value) {
  throw createError({ statusCode: 404, statusMessage: 'City not found', fatal: true })
}

usePageSeo(() => loc.value?.seo)
useFaqJsonLd(() => (loc.value?.faq?.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })))
useSeoMeta({ ogImage: () => strapiMedia(loc.value?.hero?.bgImage) })

const canonical = computed(() => loc.value?.seo?.canonicalUrl || `https://accidentprofessionals.com/georgia/${slug}/`)
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://accidentprofessionals.com/' },
            { '@type': 'ListItem', position: 2, name: 'Georgia', item: 'https://accidentprofessionals.com/georgia/' },
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
  <LocationSections :loc="loc" :def="def" />
</template>
