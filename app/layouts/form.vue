<script setup lang="ts">
/**
 * Stripped-back layout for the standalone lead-capture pages (/forms/*).
 *
 * Deliberately NOT layouts/site.vue: no nav, no sticky call button, and no lead
 * popup. These pages have exactly one job, and every extra link or interruption
 * is a way to leave without converting.
 */
const globals = useGlobals()
const settings = computed<any>(() => globals.value.settings ?? {})
const phone = computed(() => settings.value.phone || '(470) 407-2800')
const phoneHref = computed(() => settings.value.phoneHref || 'tel:4704072800')
const year = new Date().getFullYear()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-cream">
    <header class="border-b border-dark/10 bg-dark">
      <div class="mx-auto flex w-full max-w-[620px] items-center justify-between gap-4 px-5 py-4">
        <NuxtLink to="/" aria-label="Accident Professionals">
          <img
            :src="strapiMedia(settings.logo, '/brand/logo.png')"
            alt="Accident Professionals"
            width="179"
            height="37"
            class="h-[30px] w-auto"
          />
        </NuxtLink>
        <a
          :href="phoneHref"
          class="rounded-pill bg-accent px-4 py-2 font-primary text-[13.5px] font-semibold text-dark whitespace-nowrap"
        >
          {{ phone }}
        </a>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-dark/10 bg-white">
      <div
        class="mx-auto flex w-full max-w-[620px] flex-col gap-2 px-5 py-6 text-center font-primary text-[12.5px] text-muted sm:flex-row sm:justify-between sm:text-left"
      >
        <p class="m-0">© {{ year }} Accident Professionals. All rights reserved.</p>
        <NuxtLink to="/privacy-policy" class="m-0 underline underline-offset-2">Privacy Policy</NuxtLink>
      </div>
    </footer>
  </div>
</template>
