<script setup lang="ts">
import { computed } from 'vue'

// Renders a location-page (state or city). Every section is optional and only
// renders when present — a fixed order that works for both the Georgia state
// page and city pages (e.g. Atlanta).
const props = defineProps<{ loc: any; def: any; type?: 'state' | 'city' }>()

const hd = computed(() => props.def?.heroDefaults ?? {})

const hero = computed(() => {
  const h = props.loc?.hero ?? {}
  return {
    heroBg: strapiMedia(h.bgImage, '/about/hero-bg.png'),
    badge: props.loc?.heroBadge,
    h1Part1: h.h1Part1,
    h1Accent: h.h1Accent,
    h1Subtitle: h.h1Subtitle,
    accentFirst: props.loc?.heroAccentFirst,
    heroBody: h.heroBody,
    description: h.description,
    phone: hd.value.phone,
    phoneHref: hd.value.phoneHref,
    cta: hd.value.ctaLabel,
    stats: (props.loc?.heroStats ?? []).map((s: any) => ({ value: s.value, label: s.label })),
    urgencyBullets: (h.urgencyBullets ?? []).map((b: any) => b.text),
    clientCount: hd.value.clientCount || '1,200+ Clients Helped',
    caseOptions: (h.caseOptions ?? []).map((o: any) => ({ value: o.value, label: o.label })),
    routeCaseTypeMap: {},
    formSubject: h.formSubject,
  }
})

const stepsToTake = computed(() => {
  const s = props.loc?.stepsToTake
  if (!s) return null
  return {
    heading: s.heading,
    subheading: s.subheading,
    cta: 'Get Free Consultation',
    steps: (s.steps ?? []).map((x: any) => ({ number: x.number, icon: x.icon, title: x.title, description: x.description })),
  }
})

const faq = computed(() => {
  const f = props.loc?.faq
  if (!f) return null
  return {
    heading: f.heading,
    subheading: f.intro,
    items: (f.items ?? []).map((i: any) => ({ question: i.question, answer: i.answer })),
  }
})
</script>

<template>
  <div v-if="loc">
    <HeroSection :data="hero" :flat="type === 'state'" />
    <CityAreasSection v-if="loc.cities" :block="loc.cities" />
    <MediaTextSection
      v-if="loc.whyTrust"
      :block="loc.whyTrust"
      :image="strapiMedia(loc.whyTrust?.image, '/homepage/homepage-hero.png')"
      :image-alt="`${loc.title} personal injury attorney network`"
    />
    <CardGridSection v-if="loc.practiceAreas" :block="loc.practiceAreas" />
    <WhyChooseSection v-if="loc.whyChoose" :block="loc.whyChoose" />
    <FactsSection v-if="loc.facts" :block="loc.facts" />
    <StepsSection v-if="stepsToTake" :data="stepsToTake" />
    <DamagesSection v-if="loc.damages" :block="loc.damages" />
    <TestimonialsSection v-if="loc.testimonials" :block="loc.testimonials" />
    <InfoCardsSection v-if="loc.georgiaLaw" :block="loc.georgiaLaw" />
    <NearbyCitiesSection v-if="loc.nearbyCities" :block="loc.nearbyCities" />
    <FaqSection v-if="faq" :data="faq" />
    <PageBottom :closing-cta="def?.closingCta" />
  </div>
</template>
