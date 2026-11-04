<script setup lang="ts">
definePageMeta({ layout: 'site' })

// Legacy service-category pages (auto-accidents, premises-liability,
// workplace-accidents …) under /services/[category] — one dynamic route driven
// entirely from Strapi, mapped into the exact shapes the legacy SCSS section
// components expect.
const route = useRoute()
const { locale, t } = useI18n()
const lh = useLocaleHref()
const { siteUrl } = useRuntimeConfig().public
const slug = String(route.params.category)

const categoryQuery = {
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
}

const defaultsQuery = {
  populate: {
    heroDefaults: { populate: { stats: true } },
    whyUsFeatures: true,
    team: true,
    selectedAttorneys: { populate: { photo: true } },
  },
}

// Full attorney roster — the source of truth when no attorneys are curated.
const { data: roster } = await useAttorneyRoster()

const { data: cat } = await useAsyncData(`service-category-${slug}-${locale.value}`, () =>
  strapiGet('service-categories', categoryQuery, locale.value).then((r) => r?.data?.[0] ?? null),
)

const { data: def } = await useAsyncData(`service-defaults-${locale.value}`, () =>
  strapiGet('service-defaults', defaultsQuery, locale.value).then((r) => r?.data ?? null),
)

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
    imageAlt: t('alt.attorneyConsultation'),
    steps: (w.steps ?? []).map((s: any) => ({ number: s.number, title: s.title, description: s.description })),
  }
})

const caseTypes = computed(() => {
  const services = [...(cat.value?.services ?? [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
  return {
    heading: cat.value?.caseTypesHeading,
    subheading: cat.value?.caseTypesSubheading,
    cta: t('cta.freeConsultation'),
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
  heading: def.value?.team?.heading ?? t('team.heading'),
  subheading: def.value?.team?.subheading ?? '',
  attorneys: def.value?.selectedAttorneys?.length ? def.value.selectedAttorneys : (roster.value ?? []),
}))

const steps = computed(() => {
  const s = cat.value?.stepsToTake ?? {}
  return {
    heading: s.heading,
    subheading: s.subheading,
    cta: t('cta.freeConsultation'),
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
// Raw hero image, not `hero.heroBg` — that carries a generic local fallback
// which would always beat the CMS-wide default OG image.
usePageSeo(() => cat.value?.seo, { ogImage: () => strapiMedia(cat.value?.hero?.bgImage) })
useFaqJsonLd(() => faq.value.items)

const canonical = computed(() => `${siteUrl}${lh(`/services/${slug}`)}`)
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
            { '@type': 'ListItem', position: 2, name: t('nav.services'), item: `${siteUrl}${lh('/services')}` },
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
      :breadcrumb="[{ label: $t('nav.home'), to: '/' }, { label: $t('nav.services'), to: '/services' }, { label: cat?.title }]"
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
