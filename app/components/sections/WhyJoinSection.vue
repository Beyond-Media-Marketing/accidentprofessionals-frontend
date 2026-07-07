<script setup lang="ts">
interface Card {
  icon?: string | null
  title?: string | null
  description?: string | null
}
interface Block {
  heading?: string | null
  headingAccent?: string | null
  intro?: string | null
  cards?: Card[] | null
}

defineProps<{ block: Block | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section relative isolate overflow-hidden bg-dark text-on-dark">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_0%,rgba(243,175,0,0.12),transparent_60%)]" />

    <div class="site-container">
      <div class="text-center">
        <h2 class="font-secondary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.12]">
          <span v-if="block.heading" class="text-white">{{ block.heading }}</span>
          <span v-if="block.headingAccent" class="block text-accent">{{ block.headingAccent }}</span>
        </h2>
        <p v-if="block.intro" class="mx-auto mt-4 max-w-[720px] font-primary text-base leading-[1.7] text-white/60">{{ block.intro }}</p>
      </div>

      <div class="mx-auto mt-12 grid max-w-[1040px] grid-cols-1 gap-5 md:grid-cols-2 3xl:mt-16">
        <article
          v-for="(c, i) in block.cards ?? []"
          :key="i"
          class="rounded-2xl border border-white/10 bg-white/[0.04] p-7 3xl:p-8"
        >
          <div class="mb-3 flex items-start gap-3.5">
            <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <template v-if="c.icon === 'clipboard'">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M9 12h6M9 16h4" />
                </template>
                <template v-else-if="c.icon === 'globe'">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </template>
                <template v-else-if="c.icon === 'shield'">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
                </template>
                <template v-else>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </template>
              </svg>
            </span>
            <h3 class="font-secondary text-lg font-bold leading-snug text-white 3xl:text-xl">{{ c.title }}</h3>
          </div>
          <p class="font-primary text-sm leading-[1.65] text-white/60">{{ c.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
