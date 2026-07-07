<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const { strapiUrl } = useRuntimeConfig().public

const query = qs.stringify(
  { sort: ['order:asc'], populate: { photo: true }, pagination: { pageSize: 100 } },
  { encodeValuesOnly: true },
)

const { data: attorneys } = await useFetch<any>(`${strapiUrl}/api/attorneys?${query}`, {
  key: 'attorneys-directory',
  transform: (r: any) => r?.data ?? [],
})

useHead({ title: 'Our Attorney Network — Accident Professionals' })
useSeoMeta({
  description:
    'Browse the vetted personal injury attorneys in the Accident Professionals network. Every attorney is reviewed before being included.',
})

const count = computed(() => attorneys.value?.length ?? 0)
</script>

<template>
  <div>
    <!-- Header -->
    <section class="bg-dark text-on-dark">
      <div class="site-container py-16 text-center 3xl:py-20">
        <nav class="mb-5 font-primary text-sm text-white/50">
          <NuxtLink to="/legal-network" class="transition-colors hover:text-accent">Legal Network</NuxtLink>
          <span class="px-2">/</span><span class="text-white/80">Attorneys</span>
        </nav>
        <h1 class="font-secondary text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.12]">
          Meet the Attorneys in <span class="text-accent">Our Network</span>
        </h1>
        <p class="mx-auto mt-4 max-w-[680px] font-primary text-base leading-[1.7] text-white/65">
          Every attorney in the AP network has been reviewed before being included — {{ count }} and growing across Georgia.
        </p>
      </div>
    </section>

    <AttorneyCardsSection :attorneys="attorneys" />
  </div>
</template>
