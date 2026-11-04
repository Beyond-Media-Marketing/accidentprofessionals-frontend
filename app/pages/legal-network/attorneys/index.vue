<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const { locale, t } = useI18n()

const attorneysQuery = {
  sort: ['order:asc'],
  // Card fields only — without this Strapi also returns every attorney's full
  // `about` bio, which is dead weight in the directory's hydration payload.
  fields: ['name', 'slug', 'firm', 'title', 'location', 'yearsExperience', 'languages', 'practiceAreas', 'featured', 'order'],
  populate: { photo: { fields: ['url', 'alternativeText', 'updatedAt'] } },
  pagination: { pageSize: 100 },
}
const { data: attorneys } = await useAsyncData(
  `attorneys-directory-${locale.value}`,
  () => strapiGet<any[]>('attorneys', attorneysQuery, locale.value).then((r) => r?.data ?? []),
  { default: () => [] },
)

// Hero content comes from the legal-network-page single-type. Falls back to
// sensible defaults until the `directoryHero` field is deployed to the CMS.
const heroQuery = { populate: { directoryHero: { populate: { bgImage: true } } } }
const { data: heroData } = await useAsyncData(
  `attorneys-directory-hero-${locale.value}`,
  () => strapiGet('legal-network-page', heroQuery, locale.value).then((r) => r?.data?.directoryHero ?? null),
  { default: () => null },
)
const hero = computed<any>(() => heroData.value ?? {})

// Routed through usePageSeo so this page also gets a canonical, Open Graph and
// Twitter Card tags, and the global default OG image — it previously emitted a
// title and description only.
usePageSeo(
  () => ({
    metaTitle: t('directory.metaTitle'),
    metaDescription: t('directory.metaDescription'),
  }),
  { ogImage: () => strapiMedia(hero.value?.bgImage) },
)
</script>

<template>
  <div>
    <PageHero
      :eyebrow="hero.eyebrow || $t('directory.eyebrow')"
      :heading="hero.heading || $t('directory.heading')"
      :heading-accent="hero.headingAccent || $t('directory.headingAccent')"
      :accent-first="false"
      :subhead="hero.subhead || $t('directory.subhead')"
      :align="hero.align || 'center'"
      :bg-image="strapiMedia(hero.bgImage, '/about-images/hero-bg.png')"
    />

    <TeamSection :data="{ attorneys }" full-grid />

    <PageBottom />
  </div>
</template>
