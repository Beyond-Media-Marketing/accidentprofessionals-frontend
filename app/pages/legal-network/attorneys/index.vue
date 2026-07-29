<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const attorneysQuery = qs.stringify(
  { sort: ['order:asc'], populate: { photo: true }, pagination: { pageSize: 100 } },
  { encodeValuesOnly: true },
)
const { data: attorneys } = await useFetch<any>(`${strapiUrl}/api/attorneys?${attorneysQuery}`, {
  key: 'attorneys-directory',
  transform: (r: any) => r?.data ?? [],
  default: () => [],
})

// Hero content comes from the legal-network-page single-type. Falls back to
// sensible defaults until the `directoryHero` field is deployed to the CMS.
const heroQuery = qs.stringify(
  { populate: { directoryHero: { populate: { bgImage: true } } } },
  { encodeValuesOnly: true },
)
const { data: heroData } = await useFetch<any>(`${strapiUrl}/api/legal-network-page?${heroQuery}`, {
  key: 'attorneys-directory-hero',
  transform: (r: any) => r?.data?.directoryHero ?? null,
  default: () => null,
})
const hero = computed<any>(() => heroData.value ?? {})

useHead({ title: 'Our Attorney Network — Accident Professionals' })
useSeoMeta({
  description:
    'Browse the vetted personal injury attorneys in the Accident Professionals network. Every attorney is reviewed before being included.',
})
</script>

<template>
  <div>
    <PageHero
      :eyebrow="hero.eyebrow || 'LEGAL NETWORK'"
      :heading="hero.heading || 'Meet the Attorneys in'"
      :heading-accent="hero.headingAccent || 'Our Network'"
      :accent-first="false"
      :subhead="hero.subhead || 'Every attorney in the AP network has been reviewed before being included — a growing roster of vetted personal injury attorneys across Georgia.'"
      :align="hero.align || 'center'"
      :bg-image="strapiMedia(hero.bgImage, '/about/hero-bg.png')"
    />

    <TeamSection :data="{ attorneys }" full-grid />

    <PageBottom />
  </div>
</template>
