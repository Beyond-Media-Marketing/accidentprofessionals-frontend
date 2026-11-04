<script setup lang="ts">
definePageMeta({ layout: 'site' })

const { locale } = useI18n()

const query = {
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
}

const { data: page } = await useAsyncData(`about-page-${locale.value}`, () =>
  strapiGet('about-page', query, locale.value).then((r) => r?.data ?? null),
)

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
      :bg-image="strapiMedia(page.hero?.bgImage, '/about-images/hero-bg.png')"
      :stats="page.heroStats"
      stats-variant="pills"
    />

    <MediaTextSection
      :block="page.problem"
      :image="strapiMedia(page.problem?.image, '/about-images/problem.png')"
      :image-alt="$t('alt.victimPhone')"
    />

    <StepsRowSection :block="page.whatWeDo" />

    <MediaTextSection
      :block="page.whyMatters"
      :image="strapiMedia(page.whyMatters?.image, '/about-images/why-matters.png')"
      :image-alt="$t('alt.teamMeeting')"
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
