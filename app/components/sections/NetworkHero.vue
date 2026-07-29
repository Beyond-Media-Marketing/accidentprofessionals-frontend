<script setup lang="ts">
interface Cta {
  label?: string | null
  href?: string | null
  variant?: string | null
}
interface RoleCard {
  variant?: 'attorney' | 'client' | null
  title?: string | null
  body?: string | null
  cta?: Cta | null
}
interface Stat {
  value?: string | null
  label?: string | null
}
interface Hero {
  badge?: string | null
  heading?: string | null
  headingAccent?: string | null
  subhead?: string | null
  stats?: Stat[] | null
  roleCards?: RoleCard[] | null
}

defineProps<{
  data: Hero | null | undefined
  bgImage?: string | null
}>()
</script>

<template>
  <section
    v-if="data"
    class="relative isolate overflow-hidden rounded-b-[32px] bg-dark text-on-dark lg:rounded-b-[44px]"
  >
    <!-- Background: courthouse columns, darkened toward the content side -->
    <div class="absolute inset-0 -z-10">
      <img v-if="bgImage" :src="bgImage" alt="" class="h-full w-full object-cover object-right" loading="eager" decoding="async" />
      <div class="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/60" />
      <div class="absolute inset-0 bg-dark/30" />
    </div>

    <div class="site-container pb-14 pt-10 md:pb-16 md:pt-12 lg:pb-20 lg:pt-14 3xl:pb-24 3xl:pt-16">
      <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <!-- ===== Left: headline + stats ===== -->
        <div>

          <h1 class="font-secondary text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            <span v-if="data.heading" class="block text-white">{{ data.heading }}</span>
            <span v-if="data.headingAccent" class="block text-accent">{{ data.headingAccent }}</span>
          </h1>

          <p v-if="data.subhead" class="mt-6 max-w-[540px] font-primary text-[15px] leading-[1.7] text-white/70 3xl:text-base">
            {{ data.subhead }}
          </p>

          <!-- Stats -->
          <div v-if="data.stats?.length" class="mt-8 border-t border-white/12 pt-7 3xl:mt-10">
            <dl class="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
              <div v-for="(s, i) in data.stats" :key="i">
                <dt class="font-secondary text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold leading-none text-white">{{ s.value }}</dt>
                <dd class="mt-2 font-primary text-[13px] leading-snug text-white/55">{{ s.label }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- ===== Right: role cards ===== -->
        <div class="flex flex-col gap-5">
          <div
            v-for="(card, i) in data.roleCards ?? []"
            :key="i"
            class="rounded-3xl border p-6 backdrop-blur-md 3xl:p-8"
            :class="card.variant === 'client'
              ? 'border-accent/40 bg-accent/15'
              : 'border-white/12 bg-white/[0.05]'"
          >
            <div class="mb-4 flex items-center gap-3">
              <span class="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                <!-- attorney: layers -->
                <svg v-if="card.variant !== 'client'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <!-- client: user -->
                <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2 class="font-secondary text-xl font-bold text-white 3xl:text-[22px]">{{ card.title }}</h2>
            </div>

            <p class="font-primary text-sm leading-[1.65] text-white/65">{{ card.body }}</p>

            <a
              v-if="card.cta?.label"
              :href="card.cta.href || '#apply'"
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-pill px-5 py-3 font-primary text-sm font-semibold transition-all"
              :class="card.variant === 'client'
                ? 'bg-accent text-dark shadow-button hover:-translate-y-px'
                : 'border border-accent/50 bg-transparent text-accent hover:bg-accent/10'"
            >
              {{ card.cta.label }}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
