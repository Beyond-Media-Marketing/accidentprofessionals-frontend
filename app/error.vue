<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>()

const is404 = computed(() => props.error?.statusCode === 404)
const code = computed(() => props.error?.statusCode || 500)
const heading = computed(() => (is404.value ? 'Page not found' : 'Something went wrong'))
const message = computed(() =>
  is404.value
    ? "The page you're looking for may have moved or no longer exists. Let's get you back on track."
    : props.error?.statusMessage || 'An unexpected error occurred. Please try again in a moment.',
)

const quickLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Legal Network', href: '/legal-network' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '/contact-us' },
]

const goHome = () => clearError({ redirect: '/' })

useHead({
  title: computed(() => `${code.value} — ${heading.value} | Accident Professionals`),
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-dark text-on-dark">
    <!-- Backdrop -->
    <div class="absolute inset-0 -z-10">
      <img src="/images/footer-bg.webp" alt="" class="h-full w-full object-cover object-center" />
      <div class="absolute inset-0 bg-dark/80" />
    </div>

    <!-- Top bar -->
    <header class="px-6 pt-8 sm:px-10">
      <a href="/" aria-label="Accident Professionals" class="inline-block">
        <img src="/brand/footer-logo.png" alt="Accident Professionals" class="h-[34px] w-auto" />
      </a>
    </header>

    <!-- Content -->
    <main class="flex flex-1 items-center justify-center px-6 py-16">
      <div class="w-full max-w-[620px] text-center">
        <p class="font-secondary text-[clamp(5rem,18vw,10rem)] font-bold leading-none text-accent">{{ code }}</p>
        <h1 class="mt-2 font-secondary text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-tight text-white">
          {{ heading }}
        </h1>
        <p class="mx-auto mt-4 max-w-md font-primary text-[15px] leading-relaxed text-white/60">
          {{ message }}
        </p>

        <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            class="inline-flex h-[52px] items-center justify-center gap-2 rounded-pill bg-accent px-7 font-primary text-[15px] font-semibold text-dark transition-transform hover:-translate-y-px"
            @click="goHome"
          >
            Back to Home
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
          <a
            href="/contact-us"
            class="inline-flex h-[52px] items-center justify-center rounded-pill border border-white/25 px-7 font-primary text-[15px] font-semibold text-white transition-colors hover:border-accent hover:text-accent"
          >
            Get a Free Consultation
          </a>
        </div>

        <!-- Quick links -->
        <div class="mt-12 border-t border-white/10 pt-6">
          <p class="font-primary text-xs uppercase tracking-wide text-white/40">Or jump to</p>
          <ul class="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li v-for="l in quickLinks" :key="l.href">
              <a :href="l.href" class="font-primary text-sm text-white/70 transition-colors hover:text-accent">{{ l.label }}</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
