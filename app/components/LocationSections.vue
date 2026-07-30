<script setup lang="ts">
import { computed } from 'vue'

// Renders a location-page (state or city). Every section is optional and only
// renders when present — a fixed order that works for both the Georgia state
// page and city pages (e.g. Atlanta).
const props = defineProps<{ loc: any; def: any; type?: 'state' | 'city'; allCities?: any[] }>()

// ── "Where to Find Us" nearby cities ────────────────────────────────────────
// Auto-generated from the full city list: a stable shuffle seeded by the current
// slug, so every city shows a varied set of 10 (deterministic across SSR/client).
// An editor can override per city by turning off `autoNearbyCities` and filling
// the manual list in the CMS.
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0
  return h || 1
}
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice()
  const rnd = mulberry32(seed)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const nearbyCities = computed(() => {
  const manual = props.loc?.nearbyCities
  // Explicit manual override wins when the editor turns auto off.
  if (props.loc?.autoNearbyCities === false && manual?.cities?.length) return manual

  const current = props.loc?.slug
  const others = (props.allCities ?? []).filter((c: any) => c?.slug && c.slug !== current)
  const picked = seededShuffle(others, hashString(String(current || 'x'))).slice(0, 10)
  if (!picked.length) return manual?.cities?.length ? manual : null
  // Keep all the CMS-authored content (eyebrow, body, CTA, notice band, etc.);
  // only the city list is regenerated.
  return {
    ...(manual || {}),
    heading: manual?.heading || `We Also Serve These Cities Near **${props.loc?.title}**`,
    cities: picked.map((c: any) => ({ name: `${c.title}, GA`, href: `/georgia/${c.slug}` })),
  }
})

const hd = computed(() => props.def?.heroDefaults ?? {})

// Cities we serve — shared single source (see useCitiesSection).
const { data: citiesSection } = await useCitiesSection()

const heroBreadcrumb = computed(() =>
  props.type === 'city'
    ? [
        { label: 'Home', to: '/' },
        { label: 'Georgia', to: '/georgia' },
        { label: props.loc?.title },
      ]
    : [{ label: 'Home', to: '/' }, { label: props.loc?.title || 'Georgia' }],
)

const hero = computed(() => {
  const h = props.loc?.hero ?? {}
  return {
    heroBg: strapiMedia(h.bgImage, '/about-images/hero-bg.png'),
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
    <HeroSection :data="hero" :flat="type === 'state'" :breadcrumb="heroBreadcrumb" />
    <!-- This location's own hand-picked list wins; shared master is the fallback
         (state/city pages currently have none, so they inherit the master). -->
    <CityAreasSection :block="loc.cities?.regions?.length ? loc.cities : citiesSection" />
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
    <NearbyCitiesSection v-if="nearbyCities" :block="nearbyCities" />
    <FaqSection v-if="faq" :data="faq" />
    <PageBottom :closing-cta="def?.closingCta" />
  </div>
</template>
