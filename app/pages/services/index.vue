<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const populate = qs.stringify(
  {
    populate: {
      hero: { populate: { bgImage: true } },
      whyLocal: { populate: { cta: true, image: true } },
      howConnect: { populate: { cta: true, steps: true } },
      cityAreas: { populate: { regions: { populate: { cities: true } }, cta: true } },
      caseTypes: { populate: { cta: true, features: { populate: { icon: true } } } },
      gaLaw: { populate: { cards: true, images: true } },
      faq: { populate: { items: true } },
      closingCta: { populate: { cta: true } },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const { data: page } = await useFetch<any>(`${strapiUrl}/api/services-page?${populate}`, {
  key: 'services-page',
  transform: (r: any) => r?.data ?? null,
})

// Cities we serve — shared single source (see useCitiesSection).
const { data: citiesSection } = await useCitiesSection()

usePageSeo(() => page.value?.seo)

const caseOptions = [
  { value: 'car', label: 'Car Accidents' },
  { value: 'truck', label: 'Truck Accidents' },
  { value: 'rideshare', label: 'Rideshare Accidents' },
  { value: 'slip-fall', label: 'Slip & Fall' },
  { value: 'workplace', label: 'Workplace Injuries' },
  { value: 'motorcycle', label: 'Motorcycle Accidents' },
  { value: 'other', label: 'Other / Not sure' },
]
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
      :bg-image="strapiMedia(page.hero?.bgImage, '/about-images/hero-bg.png')"
    >
      <template #aside>
        <LeadForm
          :case-options="caseOptions"
          client-count="1,200+ Clients Helped"
          form-subject="New consultation request — Service Areas"
        />
      </template>
    </PageHero>

    <MediaTextSection
      :block="page.whyLocal"
      :image="strapiMedia(page.whyLocal?.image)"
      image-alt="Local Georgia personal injury attorney"
    />

    <StepsRowSection :block="page.howConnect" />

    <!-- This page's own hand-picked list wins; the shared master is the fallback. -->
    <CityAreasSection :block="page.cityAreas?.regions?.length ? page.cityAreas : citiesSection" />

    <CardGridSection :block="page.caseTypes" />

    <InfoCardsSection :block="page.gaLaw" />

    <FaqAccordion :block="page.faq" />

    <PageBottom :closing-cta="page.closingCta" />
  </div>
</template>
