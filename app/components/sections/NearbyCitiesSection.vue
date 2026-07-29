<script setup lang="ts">
interface City {
  name?: string | null
  href?: string | null
}
interface NearbyCities {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  body?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  cities?: City[] | null
  noticeHeading?: string | null
  noticeText?: string | null
  noticeCtaLabel?: string | null
  noticeCtaHref?: string | null
}
defineProps<{ block: NearbyCities | null | undefined }>()

const cityShort = (name?: string | null) => (name || '').replace(/,\s*GA$/i, '')
</script>

<template>
  <section v-if="block" class="section bg-dark">
    <div class="site-container">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <!-- Left: header -->
        <div>
          <h2
            class="mt-5 font-secondary text-3xl font-bold leading-tight text-white sm:text-4xl 3xl:text-5xl [&_strong]:text-accent"
            v-html="renderInlineMarkdown(block.heading)"
          />
          <p v-if="block.body" class="mt-4 max-w-md font-primary text-base leading-relaxed text-white/60">{{ block.body }}</p>
          <NuxtLink
            v-if="block.ctaLabel"
            :to="block.ctaHref || '#'"
            class="mt-7 inline-flex items-center gap-2 rounded-pill border border-white/25 px-6 py-3 font-primary text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
          >
            {{ block.ctaLabel }}
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </NuxtLink>
        </div>

        <!-- Right: flat city list -->
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 self-center">
          <NuxtLink
            v-for="(city, i) in block.cities ?? []"
            :key="i"
            :to="city.href || '#'"
            class="group flex items-center gap-3"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-accent">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            </span>
            <span class="font-primary text-base font-medium text-white transition-colors group-hover:text-accent">{{ cityShort(city.name) }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Don't see your city band -->
      <div
        v-if="block.noticeHeading"
        class="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center 3xl:mt-20"
      >
        <h3 class="font-secondary text-3xl font-bold text-white sm:text-4xl">{{ block.noticeHeading }}</h3>
        <p v-if="block.noticeText" class="mx-auto mt-4 max-w-2xl font-primary text-sm leading-relaxed text-white/60">{{ block.noticeText }}</p>
        <NuxtLink
          v-if="block.noticeCtaLabel"
          :to="block.noticeCtaHref || '#'"
          class="mt-7 inline-flex items-center gap-2 rounded-pill bg-accent px-7 py-3 font-primary text-sm font-semibold text-dark shadow-button transition-transform hover:-translate-y-0.5"
        >
          {{ block.noticeCtaLabel }}
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
