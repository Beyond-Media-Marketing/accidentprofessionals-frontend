<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const route = useRoute()
const slug = String(route.params.slug)
const { strapiUrl } = useRuntimeConfig().public

const query = qs.stringify(
  { filters: { slug: { $eq: slug } }, populate: { photo: true, seo: { populate: '*' } } },
  { encodeValuesOnly: true },
)

const { data: attorney } = await useFetch<any>(`${strapiUrl}/api/attorneys?${query}`, {
  key: `attorney-${slug}`,
  transform: (r: any) => r?.data?.[0] ?? null,
})

if (!attorney.value) {
  throw createError({ statusCode: 404, statusMessage: 'Attorney not found', fatal: true })
}

// Shared profile labels + CTA come from the CMS (legal-network-page). Falls back
// to sensible defaults until the `attorneyProfile` field is deployed to Cloud.
const profileQuery = qs.stringify(
  { populate: { attorneyProfile: { populate: { requestCta: true } } } },
  { encodeValuesOnly: true },
)
const { data: profileData } = await useFetch<any>(`${strapiUrl}/api/legal-network-page?${profileQuery}`, {
  key: 'attorney-profile-labels',
  transform: (r: any) => r?.data?.attorneyProfile ?? null,
  default: () => null,
})
const profile = computed<any>(() => profileData.value ?? {})

usePageSeo(() => attorney.value?.seo)
useHead({
  title: computed(() => attorney.value?.seo?.metaTitle || `${attorney.value?.name} — AP Legal Network`),
})

const paragraphs = computed<string[]>(() =>
  (attorney.value?.about || attorney.value?.shortBio || '').split(/\n\n+/).filter(Boolean),
)
const tags = computed<string[]>(() => attorney.value?.practiceAreas ?? [])
const highlights = computed<string[]>(() => attorney.value?.highlights ?? [])
</script>

<template>
  <div v-if="attorney">
    <!-- Hero -->
    <section class="bg-dark text-on-dark">
      <div class="site-container py-14 lg:py-16 3xl:py-20">
        <nav class="mb-8 font-primary text-sm text-white/50">
          <NuxtLink to="/legal-network" class="transition-colors hover:text-accent">Legal Network</NuxtLink>
          <span class="px-2">/</span>
          <NuxtLink to="/legal-network/attorneys" class="transition-colors hover:text-accent">Attorneys</NuxtLink>
          <span class="px-2">/</span><span class="text-white/80">{{ attorney.name }}</span>
        </nav>

        <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div class="overflow-hidden rounded-3xl">
            <div class="aspect-[4/5] max-w-[420px]">
              <img
                :src="strapiMedia(attorney.photo, '/services-page/auto-accidents/image1.webp')"
                :alt="attorney.name"
                class="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          <div>
            <div v-if="tags.length" class="mb-4 flex flex-wrap gap-2">
              <span v-for="(t, i) in tags" :key="i" class="rounded-md bg-white/10 px-3 py-1 font-primary text-xs font-medium text-white/80">{{ t }}</span>
            </div>
            <h1 class="font-secondary text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1]">{{ attorney.name }}</h1>
            <p v-if="attorney.title || attorney.firm" class="mt-2 font-primary text-lg text-accent">
              {{ [attorney.title, attorney.firm].filter(Boolean).join(' · ') }}
            </p>

            <dl class="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              <div v-if="attorney.location">
                <dt class="font-primary text-xs uppercase tracking-wide text-white/40">Location</dt>
                <dd class="mt-1 font-primary text-sm text-white/85">{{ attorney.location }}</dd>
              </div>
              <div v-if="attorney.yearsExperience">
                <dt class="font-primary text-xs uppercase tracking-wide text-white/40">Experience</dt>
                <dd class="mt-1 font-primary text-sm text-white/85">{{ attorney.yearsExperience }} years</dd>
              </div>
              <div v-if="attorney.languages">
                <dt class="font-primary text-xs uppercase tracking-wide text-white/40">Languages</dt>
                <dd class="mt-1 font-primary text-sm text-white/85">{{ attorney.languages }}</dd>
              </div>
            </dl>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <BaseButton
                :href="profile.requestCta?.href || '/legal-network#apply-client'"
                :variant="profile.requestCta?.variant || 'primary'"
              >
                {{ profile.requestCta?.label || 'Request This Attorney' }}
                <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
              </BaseButton>
              <BaseButton href="/legal-network/attorneys" variant="ghost">{{ profile.backLabel || 'Back to Network' }}</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Body -->
    <section class="section bg-cream">
      <div class="site-container grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] 3xl:gap-16">
        <div>
          <h2 class="font-secondary text-2xl font-bold text-dark 3xl:text-3xl">{{ profile.aboutHeading || 'About' }} {{ attorney.name?.split(' ')?.[0] }}</h2>
          <div class="mt-5 flex flex-col gap-4">
            <p v-for="(p, i) in paragraphs" :key="i" class="font-primary text-[15px] leading-[1.8] text-dark/80">{{ p }}</p>
          </div>
        </div>

        <aside v-if="highlights.length" class="h-fit rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] 3xl:p-8">
          <h3 class="mb-5 font-secondary text-lg font-bold text-dark">{{ profile.credentialsHeading || 'Credentials' }}</h3>
          <ul class="flex flex-col gap-3.5">
            <li v-for="(h, i) in highlights" :key="i" class="flex items-start gap-3 font-primary text-[15px] text-dark/80">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a]/15 text-[#16a34a]">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              {{ h }}
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <PageBottom />
  </div>
</template>
