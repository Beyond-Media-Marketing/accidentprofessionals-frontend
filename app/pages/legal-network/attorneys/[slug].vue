<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'

definePageMeta({ layout: 'site' })

const route = useRoute()
const slug = String(route.params.slug)
const { strapiUrl, siteUrl } = useRuntimeConfig().public

const query = qs.stringify(
  { filters: { slug: { $eq: slug } }, populate: { photo: true, socials: true, credentials: true, seo: { populate: '*' } } },
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

const firstName = computed(() => attorney.value?.name?.split(' ')?.[0] ?? '')
const photo = computed(() => strapiMedia(attorney.value?.photo, '/services-page/auto-accidents/image1.webp'))
const tags = computed<string[]>(() => (attorney.value?.practiceAreas ?? []).filter(Boolean))
const credentials = computed<any[]>(() => (attorney.value?.credentials ?? []).filter((c: any) => c?.title))
const socials = computed<any[]>(() => (attorney.value?.socials ?? []).filter((s: any) => s?.url))
const paragraphs = computed<string[]>(() =>
  (attorney.value?.about || attorney.value?.shortBio || '').split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean),
)

const socialLabel = (s: any) =>
  s?.label || (s?.platform ? s.platform.charAt(0).toUpperCase() + s.platform.slice(1) : 'Profile')

// Person / Attorney structured data for SEO.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Attorney',
          name: attorney.value?.name,
          jobTitle: attorney.value?.title || undefined,
          worksFor: attorney.value?.firm ? { '@type': 'Organization', name: attorney.value.firm } : undefined,
          image: photo.value,
          areaServed: attorney.value?.location || undefined,
          knowsLanguage: attorney.value?.languages || undefined,
          email: attorney.value?.email || undefined,
          telephone: attorney.value?.phone || undefined,
          sameAs: socials.value.map((s) => s.url),
          url: `${siteUrl}/legal-network/attorneys/${slug}/`,
        }),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Legal Network', item: `${siteUrl}/legal-network` },
            { '@type': 'ListItem', position: 3, name: 'Attorneys', item: `${siteUrl}/legal-network/attorneys` },
            { '@type': 'ListItem', position: 4, name: attorney.value?.name, item: `${siteUrl}/legal-network/attorneys/${slug}/` },
          ],
        }),
      ),
    },
  ],
})
</script>

<template>
  <div v-if="attorney">
    <!-- ── Profile hero ─────────────────────────────────────────── -->
    <section class="bg-white pb-4 pt-6 md:pb-6 md:pt-8 3xl:pb-8 3xl:pt-10">
      <div class="site-container">
        <Breadcrumb
          class="mb-6"
          :items="[
            { label: 'Home', to: '/' },
            { label: 'Legal Network', to: '/legal-network' },
            { label: 'Attorneys', to: '/legal-network/attorneys' },
            { label: attorney.name },
          ]"
        />

        <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] 3xl:gap-16">
          <!-- Photo with floating chips + stat cards -->
          <!-- Wrapper is NOT clipped so the cards can overhang the image's right edge -->
          <div class="relative">
            <div class="overflow-hidden rounded-[28px]">
              <div class="aspect-square">
                <img :src="photo" :alt="attorney.name" class="h-full w-full object-cover" loading="eager" />
              </div>
            </div>

            <!-- Floating glass cards, absolutely positioned + staggered (per design) -->
            <!-- practice areas — top, at the right edge -->
            <div
              v-if="tags.length"
              class="absolute right-3 top-6 max-w-[70%] rounded-2xl bg-[#969696]/[0.19] px-4 py-3 text-left backdrop-blur-[50px] lg:-right-4"
            >
              <p
                v-for="(t, i) in tags"
                :key="i"
                class="font-secondary text-sm font-bold leading-snug text-white"
              >{{ t }}</p>
              <p class="mt-1 font-primary text-[11px] uppercase tracking-wide text-accent">Practice Areas</p>
            </div>

            <!-- years of experience — middle, inset from the edge -->
            <div
              v-if="attorney.yearsExperience"
              class="absolute right-6 top-[46%] rounded-2xl bg-[#969696]/[0.19] px-4 py-3 text-left backdrop-blur-[50px] lg:right-10"
            >
              <p class="font-secondary text-xl font-bold leading-none text-white">{{ attorney.yearsExperience }} Years</p>
              <p class="mt-1 font-primary text-[11px] uppercase tracking-wide text-accent">Experience</p>
            </div>

            <!-- languages — lower, back at the right edge -->
            <div
              v-if="attorney.languages"
              class="absolute bottom-8 right-3 rounded-2xl bg-[#969696]/[0.19] px-4 py-3 text-left backdrop-blur-[50px] lg:-right-4"
            >
              <p class="font-secondary text-base font-bold leading-tight text-white">{{ attorney.languages }}</p>
              <p class="mt-1 font-primary text-[11px] uppercase tracking-wide text-accent">Languages</p>
            </div>
          </div>

          <!-- Name · position · firm · tagline · bio -->
          <div>
            <h1 class="font-secondary text-[clamp(2.1rem,4.4vw,3.25rem)] font-bold leading-[1.08] text-dark">
              {{ attorney.name }}
            </h1>

            <p v-if="attorney.title" class="mt-3 font-primary text-lg font-semibold text-accent">{{ attorney.title }}</p>
            <p v-if="attorney.firm" class="mt-0.5 font-primary text-[15px] text-dark/55">{{ attorney.firm }}</p>

            <blockquote
              v-if="attorney.tagline"
              class="mt-6 border-l-[3px] border-accent pl-5 font-primary text-xl italic leading-snug text-dark/80"
            >
              {{ attorney.tagline }}
            </blockquote>

            <div class="mt-7 flex flex-col gap-4">
              <p
                v-for="(p, i) in paragraphs"
                :key="i"
                class="font-primary text-[15px] leading-[1.85] text-dark/70"
              >{{ p }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Credentials (between the two components) ──────────────── -->
    <section v-if="credentials.length" class="bg-white py-10 md:py-12 3xl:py-16">
      <div class="site-container">
        <h2 class="font-secondary text-2xl font-bold text-dark 3xl:text-3xl">
          {{ profile.credentialsHeading || 'Education & Credentials' }}
        </h2>

        <div
          class="mt-6 grid gap-x-10 gap-y-6 3xl:mt-8"
          :class="credentials.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : credentials.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'"
        >
          <div v-for="(c, i) in credentials" :key="i" class="border-l-2 border-accent/50 pl-4">
            <p class="font-secondary text-[15px] font-bold uppercase leading-snug tracking-wide text-dark">
              {{ c.title }}<span v-if="c.period" class="ml-2 font-medium normal-case text-dark/40">{{ c.period }}</span>
            </p>
            <p v-if="c.field" class="mt-1.5 font-primary text-sm text-dark/60">{{ c.field }}</p>
            <p v-if="c.institution" class="mt-0.5 font-primary text-sm text-dark/60">{{ c.institution }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Consultation CTA (contact + lead form) ───────────────── -->
    <section class="relative isolate overflow-hidden bg-dark text-on-dark">
      <img
        src="/images/contact-hero.png"
        alt=""
        class="absolute inset-0 -z-10 h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-dark via-dark/80 to-dark/30" />

      <div class="site-container py-16 3xl:py-24">
        <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] 3xl:gap-20">
          <!-- Left: pitch + contact rows -->
          <div>
            <h2 class="font-secondary text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.1]">
              Get a Free <span class="text-accent">Consultation!</span>
            </h2>
            <p class="mt-4 max-w-md font-primary text-[15px] leading-relaxed text-white/70">
              We'll guide you through every step, providing the support and expertise you need to secure the justice and
              compensation you deserve.
            </p>

            <div class="mt-9 flex flex-col gap-5">
              <component
                :is="attorney.locationLink ? 'a' : 'div'"
                v-if="attorney.locationDetail || attorney.location"
                :href="attorney.locationLink || undefined"
                :target="attorney.locationLink ? '_blank' : undefined"
                :rel="attorney.locationLink ? 'noopener noreferrer' : undefined"
                class="group flex items-start gap-4"
              >
                <span class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-accent ring-1 ring-white/10">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span
                  class="self-center font-secondary text-base font-semibold leading-snug text-white"
                  :class="{ 'transition-colors group-hover:text-accent': attorney.locationLink }"
                >{{ attorney.locationDetail || attorney.location }}</span>
              </component>

              <a v-if="attorney.email" :href="`mailto:${attorney.email}`" class="group flex items-center gap-4">
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-accent ring-1 ring-white/10">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
                  </svg>
                </span>
                <span class="font-secondary text-lg font-semibold text-white transition-colors group-hover:text-accent">{{ attorney.email }}</span>
              </a>

              <a
                v-for="(s, i) in socials"
                :key="i"
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-4"
              >
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-accent ring-1 ring-white/10">
                  <SocialIcon :platform="s.platform" />
                </span>
                <span class="font-secondary text-lg font-semibold text-white transition-colors group-hover:text-accent">{{ socialLabel(s) }}</span>
              </a>
            </div>
          </div>

          <!-- Right: lead form -->
          <div>
            <LeadForm
              :form-subject="`Consultation request for ${attorney.name} — Accident Professionals`"
              cta-label="Get Free Consultation"
            />
          </div>
        </div>
      </div>
    </section>

    <PageBottom flat />
  </div>
</template>
