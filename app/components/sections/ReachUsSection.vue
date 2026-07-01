<script setup lang="ts">
interface Card {
  icon?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
  value?: string | null
  linkLabel?: string | null
  linkHref?: string | null
}
interface ReachUs {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  features?: Card[] | null
}

defineProps<{ block: ReachUs | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :intro="block.intro"
        align="center"
      />

      <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-fr 3xl:mt-16">
        <article
          v-for="(card, i) in block.features ?? []"
          :key="i"
          class="flex flex-col rounded-3xl border border-dark/5 bg-[#F8F6F4] p-7 3xl:p-9"
        >
          <!-- Gold circle icon -->
          <span class="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
            <img v-if="card.icon" :src="card.icon" alt="" class="h-7 w-7" loading="lazy" />
            <svg v-else class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
          </span>

          <h3 class="font-secondary text-xl font-bold leading-snug text-dark">{{ card.title }}</h3>
          <p v-if="card.subtitle" class="mt-2 font-primary text-sm font-semibold text-dark">{{ card.subtitle }}</p>
          <p v-if="card.description" class="mt-2 font-primary text-sm leading-relaxed text-muted">{{ card.description }}</p>

          <p v-if="card.value" class="mt-4 font-secondary text-lg font-bold text-dark">{{ card.value }}</p>

          <NuxtLink
            v-if="card.linkLabel"
            :to="card.linkHref || '#'"
            class="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 font-primary text-sm font-semibold text-dark shadow-button transition-transform hover:-translate-y-0.5"
          >
            {{ card.linkLabel }}
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
