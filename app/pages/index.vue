<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const populate = qs.stringify(
  {
    populate: {
      hero: { populate: { primaryCta: true, secondaryCta: true, bgImage: true } },
      stats: true,
      howWeHelp: { populate: { cta: true, image: true, highlightIcon: true, steps: true } },
      whyChooseUs: { populate: { cta: true, bgImage: true, features: { populate: { icon: true } } } },
      practiceAreas: { populate: { cta: true, features: { populate: { icon: true } } } },
      ourProcess: { populate: { cards: { populate: { cta: true } } } },
      faq: { populate: { items: true } },
      closingCta: { populate: { cta: true } },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const { data: page } = await useFetch<any>(`${strapiUrl}/api/home-page?${populate}`, {
  key: 'home-page',
  transform: (r: any) => r?.data ?? null,
})

// Cities we serve — shared single source (see useCitiesSection).
const { data: citiesSection } = await useCitiesSection()

usePageSeo(() => page.value?.seo)
</script>

<template>
  <div v-if="page">
    <PageHero
      :eyebrow="page.hero?.eyebrow"
      :heading-accent="page.hero?.headingAccent"
      :heading="page.hero?.heading"
      :subhead="page.hero?.subhead"
      :align="page.hero?.align"
      :primary-cta="page.hero?.primaryCta"
      :secondary-cta="page.hero?.secondaryCta"
      :bg-image="strapiMedia(page.hero?.bgImage)"
      :stats="page.stats"
    />

    <ProcessSection
      :block="page.howWeHelp"
      :image="strapiMedia(page.howWeHelp?.image)"
      image-alt="Accident Professionals team meeting with a client"
      :highlight-icon="strapiMedia(page.howWeHelp?.highlightIcon, '/icons/goal.svg')"
    />

    <FeatureGridSection
      :block="page.whyChooseUs"
      :bg-image="strapiMedia(page.whyChooseUs?.bgImage, '/homepage/why-choose-us-bg.png')"
    />

    <CardGridSection :block="page.practiceAreas" />

    <ProcessCardsSection :block="page.ourProcess" />

    <CityAreasSection :block="citiesSection" />

    <FaqAccordion :block="page.faq" />

    <PageBottom :closing-cta="page.closingCta" />
  </div>
</template>
