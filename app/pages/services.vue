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
      cityAreas: { populate: { regions: { populate: { cities: true } } } },
      caseTypes: { populate: { cta: true, features: true } },
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
      :heading="page.hero?.heading"
      :subhead="page.hero?.subhead"
      :align="page.hero?.align"
      :bg-image="strapiMedia(page.hero?.bgImage, '/about/hero-bg.png')"
      :overlay="false"
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
      :image="strapiMedia(page.whyLocal?.image, '/homepage/homepage-hero.png')"
      image-alt="Local Georgia personal injury attorney"
    />

    <StepsRowSection :block="page.howConnect" />

    <CityAreasSection :block="page.cityAreas" />

    <CardGridSection :block="page.caseTypes" />

    <InfoCardsSection :block="page.gaLaw" />

    <FaqAccordion :block="page.faq" />

    <PageBottom :closing-cta="page.closingCta" />
  </div>
</template>
