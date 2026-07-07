<script setup lang="ts">
interface Card {
  icon?: string | null
  number?: string | null
  title?: string | null
  body?: string | null
}
interface Block {
  heading?: string | null
  intro?: string | null
  cards?: Card[] | null
}

defineProps<{ block: Block | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section bg-white">
    <div class="site-container">
      <SectionHeader :heading="block.heading" :intro="block.intro" align="center" />

      <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 3xl:mt-16">
        <article
          v-for="(c, i) in block.cards ?? []"
          :key="i"
          class="relative overflow-hidden rounded-3xl bg-[#f3f2ef] p-7 3xl:p-8"
        >
          <!-- Ghost number -->
          <span
            v-if="c.number"
            class="pointer-events-none absolute right-4 top-3 select-none font-secondary text-[76px] font-bold leading-none text-black/[0.05] 3xl:text-[88px]"
            aria-hidden="true"
          >{{ c.number }}</span>

          <!-- Icon -->
          <span class="relative z-10 mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <template v-if="c.icon === 'phone'">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </template>
              <template v-else-if="c.icon === 'alert'">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </template>
              <template v-else-if="c.icon === 'camera'">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </template>
              <template v-else>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </template>
            </svg>
          </span>

          <h3 class="relative z-10 mb-2 font-primary text-lg font-semibold text-dark">{{ c.title }}</h3>
          <p class="relative z-10 font-primary text-sm leading-[1.65] text-muted">{{ c.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
