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
      <div
        class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1.3fr_1fr_1fr_1.1fr] lg:gap-8"
      >
        <!-- Brand -->
        <div class="flex flex-col gap-4">
          <NuxtLink to="/" aria-label="Accident Professionals" class="inline-block">
            <img :src="logo" alt="Accident Professionals" height="37" class="h-[37px] w-auto" />
          </NuxtLink>
          <p class="max-w-[320px] text-sm leading-relaxed text-muted">
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

        <!-- Where to Find Us -->
        <div class="flex flex-col gap-3">
          <p class="text-base font-semibold text-cream">{{ footer.findUsHeading || 'Where to Find Us' }}</p>
          <a
            v-if="settings.mapEmbedUrl"
            :href="settings.mapLinkUrl || '#'"
            target="_blank"
            rel="noopener"
            class="block overflow-hidden rounded-lg border border-white/10"
            aria-label="View on Google Maps"
          >
            <iframe
              :src="settings.mapEmbedUrl"
              width="100%"
              height="110"
              style="border: 0; pointer-events: none"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              aria-hidden="true"
              tabindex="-1"
            />
          </a>
          <p class="text-[13px] leading-relaxed text-muted">{{ settings.address }}</p>
        </div>

        <!-- Link columns (Case Types, Reach Out) -->
        <div v-for="(col, ci) in linkColumns" :key="ci" class="flex flex-col gap-3">
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

        <!-- Support -->
        <div class="flex flex-col gap-2.5">
          <p class="text-base font-semibold text-cream">{{ footer.supportHeading || 'Support' }}</p>
          <p v-if="availability[0]" class="text-sm text-muted">{{ availability[0] }}</p>
          <a
            v-if="phone"
            :href="phoneHref"
            class="text-lg font-semibold text-accent transition-opacity hover:opacity-85"
            @click="gtmPush({ event: 'phone_click', location: 'footer' })"
          >
            {{ phone }}
          </a>
          <p v-if="availability[1]" class="text-sm text-muted">{{ availability[1] }}</p>
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
