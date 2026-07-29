<script setup lang="ts">
import qs from 'qs'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const populate = qs.stringify(
  {
    populate: {
      hero: { populate: { bgImage: true } },
      formSection: { populate: { mapImage: true } },
      reachUs: { populate: { cta: true, features: { populate: { icon: true } } } },
      closingCta: { populate: { cta: true } },
      seo: { populate: '*' },
    },
  },
  { encodeValuesOnly: true },
)

const { data: page } = await useFetch<any>(`${strapiUrl}/api/contact-page?${populate}`, {
  key: 'contact-page',
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
      :align="page.hero?.align || 'center'"
      :bg-image="strapiMedia(page.hero?.bgImage, '/about/hero-bg.png')"
      content-width="wide"
    />

    <ContactFormSection :block="page.formSection" />

    <ReachUsSection :block="page.reachUs" />

    <PageBottom :closing-cta="page.closingCta" />
  </div>
</template>
