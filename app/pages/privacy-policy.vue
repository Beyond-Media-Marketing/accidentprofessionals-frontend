<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const query = qs.stringify({ populate: { seo: { populate: '*' } } }, { encodeValuesOnly: true })
const { data: page } = await useFetch<any>(`${strapiUrl}/api/privacy-policy?${query}`, {
  key: 'privacy-policy',
  transform: (r: any) => r?.data ?? null,
  default: () => null,
})

const title = computed(() => page.value?.title || 'Privacy Policy')
const lastUpdated = computed(() => page.value?.lastUpdated || '')
const content = computed(() => page.value?.content || '')

usePageSeo(() => page.value?.seo)
useHead({ title: computed(() => page.value?.seo?.metaTitle || `${title.value} | Accident Professionals`) })
// Legal pages are intentionally kept out of the index.
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <div>
    <!-- Header -->
    <section class="bg-cream pb-10 pt-16 md:pt-20 3xl:pt-24">
      <div class="mx-auto w-full max-w-[880px] px-6 sm:px-8">
        <p class="font-primary text-xs font-semibold uppercase tracking-[0.14em] text-accent">Legal</p>
        <h1 class="mt-3 font-secondary text-[clamp(2rem,4.4vw,3rem)] font-bold leading-[1.08] text-dark">
          {{ title }}
        </h1>
        <p v-if="lastUpdated" class="mt-4 font-primary text-sm text-muted">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <!-- Body -->
    <section class="bg-white py-12 md:py-16 3xl:py-20">
      <div class="mx-auto w-full max-w-[880px] px-6 sm:px-8">
        <ProseHtml :html="content" />
      </div>
    </section>

    <PageBottom />
  </div>
</template>
