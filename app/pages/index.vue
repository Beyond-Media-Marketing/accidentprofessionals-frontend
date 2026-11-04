<script setup lang="ts">
definePageMeta({ layout: 'site' })

const { locale } = useI18n()

const query = {
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
}

const { data: page } = await useAsyncData(`home-page-${locale.value}`, () =>
  strapiGet('home-page', query, locale.value).then((r) => r?.data ?? null),
)

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
      :image-alt="$t('alt.teamMeeting')"
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
