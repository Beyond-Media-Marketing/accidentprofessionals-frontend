<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const populate = qs.stringify(
  {
    populate: {
      hero: { populate: { bgImage: true, stats: true, roleCards: { populate: { cta: true } } } },
      betterWay: { populate: { cta: true, ctaSecondary: true, image: true } },
      reviewSteps: { populate: { cards: true } },
      attorneysCta: true,
      selectedAttorneys: { populate: { photo: true } },
      whyJoin: { populate: { cards: true } },
      lookFor: { populate: { image: true, preferred: true, mustHaves: true, cta: true } },
      dualCta: { populate: { primaryCta: true, secondaryCta: true } },
      faq: { populate: { clientFaqs: true, attorneyFaqs: true } },
      applyForms: {
        populate: {
          attorneyForm: { populate: { image: true } },
          clientForm: { populate: { image: true } },
        },
      },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

// Full roster fallback — used when no attorneys are curated in the CMS.
const attorneysQuery = qs.stringify(
  { sort: ['order:asc'], populate: { photo: true }, pagination: { pageSize: 100 } },
  { encodeValuesOnly: true },
)

const { data } = await useAsyncData('legal-network', async () => {
  const [pageRes, attorneysRes] = await Promise.all([
    $fetch<any>(`${strapiUrl}/api/legal-network-page?${populate}`),
    $fetch<any>(`${strapiUrl}/api/attorneys?${attorneysQuery}`),
  ])
  return { page: pageRes?.data ?? null, attorneys: attorneysRes?.data ?? [] }
})

const page = computed(() => data.value?.page ?? null)
// Curated selection from the CMS if set, otherwise the full roster.
const attorneys = computed(() =>
  page.value?.selectedAttorneys?.length ? page.value.selectedAttorneys : (data.value?.attorneys ?? []),
)

usePageSeo(() => page.value?.seo)
useSeoMeta({ ogImage: () => strapiMedia(page.value?.hero?.bgImage) })
</script>

<template>
  <div v-if="page">
    <NetworkHero :data="page.hero" :bg-image="strapiMedia(page.hero?.bgImage, '/about-images/hero-bg.png')" />

    <MediaTextSection
      :block="page.betterWay"
      :image="strapiMedia(page.betterWay?.image, '/about-images/why-matters.png')"
      image-alt="Attorney and client shaking hands"
    />

    <ReviewStepsSection :block="page.reviewSteps" />

    <TeamSection
      :data="{
        heading: page.attorneysHeading,
        subheading: page.attorneysSubheading,
        attorneys,
        cta: page.attorneysCta,
      }"
    />

    <WhyJoinSection :block="page.whyJoin" />

    <LookForSection
      :block="page.lookFor"
      :image="strapiMedia(page.lookFor?.image)"
    />

    <DualCtaBand :block="page.dualCta" />

    <FaqTabsSection :block="page.faq" />

    <ApplyFormsSection
      :block="page.applyForms"
      :attorney-image="strapiMedia(page.applyForms?.attorneyForm?.image, '/about-images/why-matters.png')"
      :client-image="strapiMedia(page.applyForms?.clientForm?.image, '/about-images/problem.png')"
    />

    <PageBottom />
  </div>
</template>
