<script setup lang="ts">
definePageMeta({ layout: 'site' })

const { locale } = useI18n()

const query = {
  populate: {
    hero: { populate: { bgImage: true } },
    formSection: { populate: { mapImage: true } },
    reachUs: { populate: { cta: true, features: { populate: { icon: true } } } },
    closingCta: { populate: { cta: true } },
    seo: { populate: '*' },
  },
}

const { data: page } = await useAsyncData(`contact-page-${locale.value}`, () =>
  strapiGet('contact-page', query, locale.value).then((r) => r?.data ?? null),
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
      :align="page.hero?.align || 'center'"
      :bg-image="strapiMedia(page.hero?.bgImage, '/about-images/hero-bg.png')"
      content-width="wide"
    />

    <ContactFormSection :block="page.formSection" />

    <ReachUsSection :block="page.reachUs" />

    <PageBottom :closing-cta="page.closingCta" />
  </div>
</template>
