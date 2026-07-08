<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

const route = useRoute()
const { strapiUrl } = useRuntimeConfig().public
const categorySlug = String(route.params.category)
const serviceSlug = String(route.params.service)

const serviceQuery = qs.stringify(
  {
    filters: { slug: { $eq: serviceSlug }, category: { slug: { $eq: categorySlug } } },
    populate: {
      hero: { populate: { bgImage: true, urgencyBullets: true, caseOptions: true } },
      whatToKnow: { populate: { cta: true, image: true } },
      howItWorks: { populate: { steps: true, image: true } },
      typesOfCases: { populate: { cta: true, features: { populate: { icon: true } } } },
      stepsToTake: { populate: { steps: true } },
      damages: { populate: { tabs: { populate: { items: true } }, cta: true } },
      testimonials: { populate: { items: true } },
      faq: { populate: { items: true } },
      category: true,
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const defaultsQuery = qs.stringify(
  {
    populate: {
      heroDefaults: { populate: { stats: true } },
      team: true,
      selectedAttorneys: { populate: { photo: true } },
      cities: { populate: { regions: { populate: { cities: true } } } },
      closingCta: { populate: { cta: true } },
    },
  },
  { encodeValuesOnly: true },
)

// Full attorney roster — the source of truth when no attorneys are curated.
const { data: roster } = await useAttorneyRoster()

const { data: svc } = await useFetch<any>(`${strapiUrl}/api/services?${serviceQuery}`, {
  key: `service-${categorySlug}-${serviceSlug}`,
  transform: (r: any) => r?.data?.[0] ?? null,
})
const { data: def } = await useFetch<any>(`${strapiUrl}/api/service-defaults?${defaultsQuery}`, {
  key: 'service-defaults-sub',
  transform: (r: any) => r?.data ?? null,
})

if (!svc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}

const hd = computed(() => def.value?.heroDefaults ?? {})

// ── Map Strapi → component shapes ────────────────────────────────────────────
const hero = computed(() => {
  const h = svc.value?.hero ?? {}
  return {
    heroBg: strapiMedia(h.bgImage, '/about/hero-bg.png'),
    badge: (svc.value?.title || '').toUpperCase(),
    h1Part1: h.h1Part1,
    h1Accent: h.h1Accent,
    h1Subtitle: h.h1Subtitle,
    heroBody: h.heroBody,
    description: h.description,
    phone: hd.value.phone,
    phoneHref: hd.value.phoneHref,
    cta: hd.value.ctaLabel,
    stats: [],
    urgencyBullets: (h.urgencyBullets ?? []).map((b: any) => b.text),
    clientCount: hd.value.clientCount,
    caseOptions: (h.caseOptions ?? []).map((o: any) => ({ value: o.value, label: o.label })),
    routeCaseTypeMap: {},
    formSubject: h.formSubject,
  }
})

const howItWorks = computed(() => {
  const w = svc.value?.howItWorks ?? {}
  return {
    heading: w.heading,
    subheading: w.subheading,
    image: strapiMedia(w.image, '/services-page/auto-accidents/image1.webp'),
    imageAlt: `${svc.value?.title} — Accident Professionals`,
    steps: (w.steps ?? []).map((s: any) => ({ number: s.number, title: s.title, description: s.description })),
  }
})

const stepsToTake = computed(() => {
  const s = svc.value?.stepsToTake ?? {}
  return {
    heading: s.heading,
    subheading: s.subheading,
    cta: 'Get Free Consultation',
    steps: (s.steps ?? []).map((x: any) => ({ number: x.number, icon: x.icon, title: x.title, description: x.description })),
  }
})

const team = computed(() => ({
  heading: def.value?.team?.heading ?? 'Our Attorneys',
  subheading: def.value?.team?.subheading ?? '',
  attorneys: def.value?.selectedAttorneys?.length ? def.value.selectedAttorneys : (roster.value ?? []),
}))

const faq = computed(() => {
  const f = svc.value?.faq ?? {}
  return {
    heading: f.heading,
    subheading: f.intro,
    items: (f.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })),
  }
})

// ── SEO ──────────────────────────────────────────────────────────────────────
usePageSeo(() => svc.value?.seo)
useFaqJsonLd(() => faq.value.items)
useSeoMeta({ ogImage: () => hero.value.heroBg })

const canonical = computed(
  () => svc.value?.seo?.canonicalUrl || `https://accidentprofessionals.com/services/${categorySlug}/${serviceSlug}/`,
)
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
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://accidentprofessionals.com/services/' },
            { '@type': 'ListItem', position: 3, name: svc.value?.category?.title, item: `https://accidentprofessionals.com/services/${categorySlug}/` },
            { '@type': 'ListItem', position: 4, name: svc.value?.title, item: canonical.value },
          ],
        }),
      ),
    },
  ],
})

useScrollReveal()
</script>

<template>
  <div v-if="svc">
    <HeroSection :data="hero" />
    <MediaTextSection
      :block="svc.whatToKnow"
      :image="strapiMedia(svc.whatToKnow?.image, '/homepage/homepage-hero.png')"
      :image-alt="`${svc.title} in Georgia`"
      highlight-icon="/icons/trusted-network.svg"
    />
    <HowItWorksSection :data="howItWorks" />
    <CardGridSection :block="svc.typesOfCases" stacked />
    <StepsSection :data="stepsToTake" />
    <DamagesSection :block="svc.damages" />
    <TestimonialsSection :block="svc.testimonials" />
    <TeamSection :data="team" />
    <CityAreasSection :block="def?.cities" />
    <FaqSection :data="faq" />
    <PageBottom :closing-cta="def?.closingCta" />
  </div>
</template>
