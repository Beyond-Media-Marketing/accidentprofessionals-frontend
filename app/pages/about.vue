<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const populate = qs.stringify(
  {
    populate: {
      hero: { populate: { primaryCta: true, secondaryCta: true, bgImage: true } },
      heroStats: true,
      problem: { populate: { cta: true, image: true } },
      whatWeDo: { populate: { cta: true, steps: true } },
      whyMatters: { populate: { cta: true, image: true } },
      whoWeWork: { populate: { cards: { populate: { cta: true } } } },
      areasServe: { populate: { cities: true, cta: true } },
      faq: { populate: { items: true } },
      closingCta: { populate: { cta: true } },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const { data: page } = await useFetch<any>(`${strapiUrl}/api/about-page?${populate}`, {
  key: 'about-page',
  transform: (r: any) => r?.data ?? null,
})

usePageSeo(() => page.value?.seo)
</script>

<template>
  <div v-if="page">
    <PageHero
      :eyebrow="page.hero?.eyebrow"
      :heading-accent="page.hero?.headingAccent"
      :accent-first="false"
      :heading="page.hero?.heading"
      :subhead="page.hero?.subhead"
      :align="page.hero?.align"
      :primary-cta="page.hero?.primaryCta"
      :secondary-cta="page.hero?.secondaryCta"
      :bg-image="strapiMedia(page.hero?.bgImage, '/about/hero-bg.png')"
      :stats="page.heroStats"
      stats-variant="pills"
    />

    <MediaTextSection
      :block="page.problem"
      :image="strapiMedia(page.problem?.image, '/about/problem.png')"
      image-alt="Accident victim reviewing their case on the phone"
    />

    <StepsRowSection :block="page.whatWeDo" />

    <MediaTextSection
      :block="page.whyMatters"
      :image="strapiMedia(page.whyMatters?.image, '/about/why-matters.png')"
      image-alt="The Accident Professionals team meeting with a client"
    />

    <ProcessCardsSection :block="page.whoWeWork" />

    <LocationsSection
      :block="page.areasServe"
      :bg-image="strapiMedia(page.areasServe?.bgImage, '/homepage/where-to-find-us-bg.png')"
    />

    <FaqAccordion :block="page.faq" />

    <PageBottom :closing-cta="page.closingCta" />
  </div>
</template>
