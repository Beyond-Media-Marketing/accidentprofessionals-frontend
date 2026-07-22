<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'

const globals = useGlobals()
const { push: gtmPush } = useDataLayer()

const settings = computed(() => globals.value.settings ?? {})
const footer = computed(() => globals.value.footer ?? {})

const logo = computed(() => strapiMedia(settings.value.footerLogo, '/brand/footer-logo.png'))
const socials = computed<any[]>(() => settings.value.socials ?? [])
const availability = computed<string[]>(() => settings.value.availability ?? [])
const phone = computed(() => settings.value.phone || '')
const phoneHref = computed(() => settings.value.phoneHref || '#')

const linkColumns = computed<any[]>(() => footer.value.linkColumns ?? [])
const legalLinks = computed<any[]>(() => footer.value.legalLinks ?? [])

const copyright = computed(() =>
  (footer.value.copyright || '© {year} Accident Professionals.').replace('{year}', String(new Date().getFullYear())),
)
</script>

<template>
  <footer class="relative overflow-hidden text-on-dark">
    <div class="site-container pb-12 pt-16 3xl:pt-20">
      <div class="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.5fr] lg:gap-x-10">
        <!-- Brand -->
        <div class="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <NuxtLink to="/" aria-label="Accident Professionals" class="inline-block">
            <img :src="logo" alt="Accident Professionals" height="37" class="h-[37px] w-auto" />
          </NuxtLink>
          <p class="max-w-[340px] text-sm leading-relaxed text-muted">
            {{ footer.tagline || settings.tagline }}
          </p>
          <ul class="mt-1 flex gap-2.5">
            <li v-for="(s, i) in socials" :key="i">
              <a
                :href="s.url"
                target="_blank"
                rel="noopener"
                :aria-label="s.label || s.platform"
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted transition-colors hover:bg-white/10 hover:text-accent"
              >
                <SocialIcon :platform="s.platform" />
              </a>
            </li>
          </ul>
        </div>

        <!-- Link columns (Case Types, Reach Out) — side by side on mobile -->
        <div v-for="(col, ci) in linkColumns" :key="ci" class="flex flex-col gap-3.5">
          <p class="text-base font-semibold text-cream">{{ col.heading }}</p>
          <ul class="space-y-2.5">
            <li v-for="(link, li) in col.links ?? []" :key="li">
              <NuxtLink
                :to="link.href || '#'"
                class="text-sm text-muted transition-colors hover:text-accent"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact & Support (merged) -->
        <div class="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <p class="text-base font-semibold text-cream">{{ footer.supportHeading || 'Contact Us' }}</p>

          <a
            v-if="phone"
            :href="phoneHref"
            class="inline-flex w-fit items-center gap-2.5 rounded-pill bg-accent px-5 py-2.5 font-primary text-[15px] font-semibold text-dark transition-transform hover:-translate-y-0.5"
            @click="gtmPush({ event: 'phone_click', location: 'footer' })"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02l-2.2 2.2z" />
            </svg>
            {{ phone }}
          </a>
          <p v-if="availability.length" class="text-[13px] leading-relaxed text-muted">{{ availability.join(' · ') }}</p>
          <p v-if="settings.address" class="text-[13px] leading-relaxed text-muted">{{ settings.address }}</p>

          <a
            v-if="settings.mapEmbedUrl"
            :href="settings.mapLinkUrl || '#'"
            target="_blank"
            rel="noopener"
            class="mt-1 block max-w-[320px] overflow-hidden rounded-lg border border-white/10"
            aria-label="View on Google Maps"
          >
            <iframe
              :src="settings.mapEmbedUrl"
              width="100%"
              height="92"
              style="border: 0; pointer-events: none"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              aria-hidden="true"
              tabindex="-1"
            />
          </a>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 border-t border-white/10 pt-6 text-center">
        <ul v-if="legalLinks.length" class="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <li v-for="(l, i) in legalLinks" :key="i">
            <NuxtLink
              v-if="!l.external"
              :to="l.href || '#'"
              class="text-sm text-muted transition-colors hover:text-accent"
            >{{ l.label }}</NuxtLink>
            <a
              v-else
              :href="l.href || '#'"
              target="_blank"
              rel="noopener"
              class="text-sm text-muted transition-colors hover:text-accent"
            >{{ l.label }}</a>
          </li>
        </ul>
        <p class="text-sm text-muted">{{ copyright }}</p>
        <p v-if="footer.builtByName" class="mt-1.5 text-xs text-muted/70">
          {{ footer.builtByLabel || 'Designed & Built by' }}
          <a
            :href="footer.builtByHref || '#'"
            target="_blank"
            rel="noopener"
            class="underline underline-offset-2 transition-colors hover:text-accent"
          >
            {{ footer.builtByName }}
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
