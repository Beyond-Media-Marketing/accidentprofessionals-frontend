<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

// Legacy service-category pages (auto-accidents, premises-liability,
// workplace-accidents …) under /services/[category] — one dynamic route driven
// entirely from Strapi, mapped into the exact shapes the legacy SCSS section
// components expect.
const route = useRoute()
const { strapiUrl } = useRuntimeConfig().public
const slug = String(route.params.category)

const categoryQuery = qs.stringify(
  {
    filters: { slug: { $eq: slug } },
    populate: {
      hero: { populate: { bgImage: true, urgencyBullets: true, caseOptions: true } },
      howItWorks: { populate: { steps: true, image: true } },
      whyUs: true,
      stepsToTake: { populate: { steps: true } },
      faq: { populate: { items: true } },
      ctaBanner: { populate: { caseOptions: true } },
      // `hero` is populated (one field) only to detect whether a sub-service has a
      // built page — stubs with no hero don't get a card link.
      services: { populate: { cardIcon: true, hero: { fields: ['h1Part1'] } } },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const defaultsQuery = qs.stringify(
  {
    populate: {
      heroDefaults: { populate: { stats: true } },
      whyUsFeatures: true,
      team: true,
      selectedAttorneys: { populate: { photo: true } },
    },
  },
  { encodeValuesOnly: true },
)

// Full attorney roster — the source of truth when no attorneys are curated.
const { data: roster } = await useAttorneyRoster()

const { data: cat } = await useFetch<any>(`${strapiUrl}/api/service-categories?${categoryQuery}`, {
  key: `service-category-${slug}`,
  transform: (r: any) => r?.data?.[0] ?? null,
})

const { data: def } = await useFetch<any>(`${strapiUrl}/api/service-defaults?${defaultsQuery}`, {
  key: 'service-defaults',
  transform: (r: any) => r?.data ?? null,
})

if (!cat.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service category not found', fatal: true })
}

const hd = computed(() => def.value?.heroDefaults ?? {})

// ── Map Strapi → legacy component data shapes ────────────────────────────────
const hero = computed(() => {
  const h = cat.value?.hero ?? {}
  return {
    heroBg: strapiMedia(h.bgImage, '/about-images/hero-bg.png'),
    badge: hd.value.badge,
    h1Part1: h.h1Part1,
    h1Accent: h.h1Accent,
    h1Subtitle: h.h1Subtitle,
    heroBody: h.heroBody,
    description: h.description,
    phone: hd.value.phone,
    phoneHref: hd.value.phoneHref,
    cta: hd.value.ctaLabel,
    stats: hd.value.stats ?? [],
    urgencyBullets: (h.urgencyBullets ?? []).map((b: any) => b.text),
    clientCount: hd.value.clientCount,
    caseOptions: (h.caseOptions ?? []).map((o: any) => ({ value: o.value, label: o.label })),
    routeCaseTypeMap: {},
    formSubject: h.formSubject,
  }
})

const howItWorks = computed(() => {
  const w = cat.value?.howItWorks ?? {}
  return {
    heading: w.heading,
    subheading: w.subheading,
    image: strapiMedia(w.image, '/services-page/auto-accidents/image1.webp'),
    imageAlt: 'Accident Professionals attorney consultation',
    steps: (w.steps ?? []).map((s: any) => ({ number: s.number, title: s.title, description: s.description })),
  }
})

const caseTypes = computed(() => {
  const services = [...(cat.value?.services ?? [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
  return {
    heading: cat.value?.caseTypesHeading,
    subheading: cat.value?.caseTypesSubheading,
    cta: 'Get Free Consultation',
    cases: services.map((s: any) => ({
      icon: strapiMedia(s.cardIcon, '/icons/shield.svg'),
      title: s.title,
      description: s.cardDescription,
      // Only sub-services that actually have a built page (a hero) get a link.
      hasPage: !!s.hero,
      link: `/services/${slug}/${s.slug}`,
      linkText: s.cardLinkText,
      linkAnchor: s.cardLinkAnchor,
    })),
  }
})

const whyUs = computed(() => {
  const w = cat.value?.whyUs ?? {}
  return {
    heading: w.heading,
    headingAccent: w.headingAccent,
    body1: w.body1,
    body2: w.body2,
    body3: w.body3,
    features: (def.value?.whyUsFeatures ?? []).map((f: any) => ({
      iconGrey: f.iconGrey,
      iconYellow: f.iconYellow,
      title: f.title,
      description: f.description,
    })),
  }
})

const team = computed(() => ({
  heading: def.value?.team?.heading ?? 'Our Attorneys',
  subheading: def.value?.team?.subheading ?? '',
  attorneys: def.value?.selectedAttorneys?.length ? def.value.selectedAttorneys : (roster.value ?? []),
}))

const steps = computed(() => {
  const s = cat.value?.stepsToTake ?? {}
  return {
    heading: s.heading,
    subheading: s.subheading,
    cta: 'Get Free Consultation',
    steps: (s.steps ?? []).map((x: any) => ({ number: x.number, icon: x.icon, title: x.title, description: x.description })),
  }
})

const faq = computed(() => {
  const f = cat.value?.faq ?? {}
  return {
    heading: f.heading,
    subheading: f.intro,
    items: (f.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })),
  }
})

const ctaBanner = computed(() => {
  const c = cat.value?.ctaBanner ?? {}
  return {
    heading: `${c.headingMain ?? ''}${c.headingAccent ?? ''}`,
    headingMain: c.headingMain,
    headingAccent: c.headingAccent,
    subheading: c.subheading,
    phone: hd.value.phone,
    phoneHref: hd.value.phoneHref,
    cta: hd.value.ctaLabel,
    formSubject: c.formSubject,
    caseOptions: (c.caseOptions ?? []).map((o: any) => ({ value: o.value, label: o.label })),
  }
})

// ── SEO ──────────────────────────────────────────────────────────────────────
usePageSeo(() => cat.value?.seo)
useFaqJsonLd(() => faq.value.items)
useSeoMeta({ ogImage: () => hero.value.heroBg })

const canonical = computed(() => cat.value?.seo?.canonicalUrl || `https://accidentprofessionals.com/services/${slug}`)
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
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://accidentprofessionals.com/services' },
            { '@type': 'ListItem', position: 3, name: cat.value?.title, item: canonical.value },
          ],
        }),
      ),
    },
  ],
})

useScrollReveal()
</script>

<template>
  <div v-if="cat">
    <HeroSection
      :data="hero"
      :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: cat?.title }]"
    />
    <HowItWorksSection :data="howItWorks" />
    <CaseTypesSection :data="caseTypes" />
    <WhyUsSection :data="whyUs" />
    <TeamSection :data="team" />
    <CtaBanner :data="ctaBanner" />
    <StepsSection :data="steps" />
    <FaqSection :data="faq" />
    <ContactSection :data="ctaBanner" />
    <PageBottom />
  </div>
</template>
