<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public
const slug = 'georgia'

const locationQuery = qs.stringify(
  {
    filters: { slug: { $eq: slug } },
    populate: {
      hero: { populate: { urgencyBullets: true, caseOptions: true } },
      heroStats: true,
      cities: { populate: { regions: { populate: { cities: true } } } },
      practiceAreas: { populate: { cta: true, features: true } },
      facts: { populate: { stats: true } },
      testimonials: { populate: { items: true } },
      faq: { populate: { items: true } },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const defaultsQuery = qs.stringify(
  { populate: { heroDefaults: true, closingCta: { populate: { cta: true } } } },
  { encodeValuesOnly: true },
)

const { data: loc } = await useFetch<any>(`${strapiUrl}/api/location-pages?${locationQuery}`, {
  key: `location-${slug}`,
  transform: (r: any) => r?.data?.[0] ?? null,
})
const { data: def } = await useFetch<any>(`${strapiUrl}/api/service-defaults?${defaultsQuery}`, {
  key: 'service-defaults-location',
  transform: (r: any) => r?.data ?? null,
})

if (!loc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Location not found', fatal: true })
}

const hd = computed(() => def.value?.heroDefaults ?? {})

const hero = computed(() => {
  const h = loc.value?.hero ?? {}
  return {
    heroBg: h.bgImage,
    badge: loc.value?.heroBadge,
    h1Part1: h.h1Part1,
    h1Accent: h.h1Accent,
    h1Subtitle: h.h1Subtitle,
    accentFirst: loc.value?.heroAccentFirst,
    heroBody: h.heroBody,
    description: h.description,
    phone: hd.value.phone,
    phoneHref: hd.value.phoneHref,
    cta: hd.value.ctaLabel,
    stats: (loc.value?.heroStats ?? []).map((s: any) => ({ value: s.value, label: s.label })),
    urgencyBullets: (h.urgencyBullets ?? []).map((b: any) => b.text),
    clientCount: hd.value.clientCount || '1,200+ Clients Helped',
    caseOptions: (h.caseOptions ?? []).map((o: any) => ({ value: o.value, label: o.label })),
    routeCaseTypeMap: {},
    formSubject: h.formSubject,
  }
})

const faq = computed(() => {
  const f = loc.value?.faq ?? {}
  return {
    heading: f.heading,
    subheading: f.intro,
    items: (f.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })),
  }
})

usePageSeo(() => loc.value?.seo)
useFaqJsonLd(() => faq.value.items)
useSeoMeta({ ogImage: () => hero.value.heroBg })

const canonical = computed(() => loc.value?.seo?.canonicalUrl || `https://accidentprofessionals.com/${slug}/`)
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
  <div v-if="loc">
    <HeroSection :data="hero" />
    <CityAreasSection :block="loc.cities" />
    <CardGridSection :block="loc.practiceAreas" />
    <FactsSection :block="loc.facts" />
    <TestimonialsSection :block="loc.testimonials" />
    <FaqSection :data="faq" />
    <PageBottom :closing-cta="def?.closingCta" />
  </div>
</template>
