<script setup lang="ts">
definePageMeta({ layout: 'site' })

const { locale, t } = useI18n()

const query = {
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
}

const { data: page } = await useAsyncData(`services-page-${locale.value}`, () =>
  strapiGet('services-page', query, locale.value).then((r) => r?.data ?? null),
)

// Cities we serve — shared single source (see useCitiesSection).
const { data: citiesSection } = await useCitiesSection()

usePageSeo(() => page.value?.seo)

const caseOptions = computed(() => defaultCaseOptions(t))
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
          :client-count="$t('hero.clientsHelped')"
          form-subject="New consultation request — Service Areas"
        />
      </template>
    </PageHero>

    <MediaTextSection
      :block="page.whyLocal"
      :image="strapiMedia(page.whyLocal?.image)"
      :image-alt="$t('alt.localAttorney')"
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
