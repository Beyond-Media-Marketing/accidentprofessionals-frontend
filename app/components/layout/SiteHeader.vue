<script setup lang="ts">
import { useDataLayer } from '../../composables/useDataLayer'

const globals = useGlobals()
const { push: gtmPush } = useDataLayer()

const settings = computed(() => globals.value.settings ?? {})
const nav = computed(() => globals.value.navigation ?? {})
const items = computed<any[]>(() => nav.value.items ?? [])
const cta = computed(() => nav.value.cta ?? null)

const logo = computed(() => strapiMedia(settings.value.logo, '/brand/logo.png'))
const phone = computed(() => settings.value.phone || '')
const phoneHref = computed(() => settings.value.phoneHref || (phone.value ? `tel:${phone.value.replace(/[^\d+]/g, '')}` : '#'))

// Desktop: which mega menu is open (index), or null.
const activeMenu = ref<number | null>(null)
// Mobile drawer + which item is expanded in the accordion.
const mobileOpen = ref(false)
const mobileExpanded = ref<number | null>(null)

function toggleMobileItem(i: number) {
  mobileExpanded.value = mobileExpanded.value === i ? null : i
}
function closeAll() {
  activeMenu.value = null
  mobileOpen.value = false
  mobileExpanded.value = null
}

// Lock body scroll while the mobile drawer is open.
watch(mobileOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

// Close menus on route change.
const route = useRoute()
watch(() => route.fullPath, closeAll)

function onPhoneClick() {
  gtmPush({ event: 'phone_click', location: 'header' })
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-black/5 bg-white" @keydown.escape="closeAll">
    <div class="site-container flex h-[80px] items-center gap-8 3xl:h-[92px]">
      <!-- Logo -->
      <NuxtLink to="/" class="flex-shrink-0" aria-label="Accident Professionals — Home" @click="closeAll">
        <img :src="logo" alt="Accident Professionals" height="37" class="h-[37px] w-auto" />
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
        <ul class="flex items-center gap-7">
          <li
            v-for="(item, i) in items"
            :key="i"
            class="relative"
            @mouseenter="item.hasMegaMenu ? (activeMenu = i) : null"
            @mouseleave="item.hasMegaMenu ? (activeMenu = null) : null"
          >
            <!-- Mega-menu trigger -->
            <button
              v-if="item.hasMegaMenu"
              type="button"
              class="flex items-center gap-1 whitespace-nowrap text-[13px] font-medium uppercase tracking-wide text-dark transition-colors hover:text-accent"
              :aria-expanded="activeMenu === i"
              @click="activeMenu = activeMenu === i ? null : i"
              @focus="activeMenu = i"
            >
              {{ item.label }}
              <svg
                class="h-3 w-3 transition-transform"
                :class="{ 'rotate-180': activeMenu === i }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <!-- Plain link -->
            <NuxtLink
              v-else
              :to="item.href || '#'"
              class="whitespace-nowrap text-[13px] font-medium uppercase tracking-wide text-dark transition-colors hover:text-accent"
            >
              {{ item.label }}
            </NuxtLink>

            <!-- Mega-menu panel -->
            <Transition name="mega">
              <div
                v-if="item.hasMegaMenu && activeMenu === i"
                class="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
              >
                <div
                  class="grid gap-8 rounded-xl border border-black/5 bg-white p-6 shadow-card"
                  :style="{ gridTemplateColumns: `repeat(${Math.max(item.columns?.length || 1, 1)}, minmax(180px, 1fr))` }"
                >
                  <div v-for="(col, ci) in item.columns ?? []" :key="ci">
                    <NuxtLink
                      v-if="col.href"
                      :to="col.href"
                      class="mb-3 block text-[12px] font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                    >{{ col.heading }}</NuxtLink>
                    <p v-else class="mb-3 text-[12px] font-semibold uppercase tracking-wide text-muted">
                      {{ col.heading }}
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(link, li) in col.links ?? []" :key="li">
                        <NuxtLink
                          :to="link.href || '#'"
                          class="block whitespace-nowrap text-sm font-medium text-dark transition-colors hover:text-accent"
                        >
                          {{ link.label }}
                          <span v-if="link.description" class="mt-0.5 block text-xs font-normal text-muted">
                            {{ link.description }}
                          </span>
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Transition>
          </li>
        </ul>
      </nav>

      <!-- Desktop contact + CTA -->
      <div class="ml-auto hidden items-center gap-5 lg:flex">
        <a
          v-if="phone"
          :href="phoneHref"
          class="whitespace-nowrap text-base font-semibold text-dark transition-colors hover:text-accent"
          @click="onPhoneClick"
        >
          {{ phone }}
        </a>
        <a
          v-if="cta"
          :href="cta.href || '#contact-section'"
          class="inline-flex h-[50px] items-center justify-center whitespace-nowrap rounded-pill bg-accent px-6 text-base font-semibold text-dark transition-transform hover:-translate-y-px"
        >
          {{ cta.label }}
        </a>
      </div>

      <!-- Mobile: phone + hamburger -->
      <div class="ml-auto flex items-center gap-3 lg:hidden">
        <a v-if="phone" :href="phoneHref" class="whitespace-nowrap text-sm font-semibold text-accent" @click="onPhoneClick">
          {{ phone }}
        </a>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-md text-dark"
          :aria-expanded="mobileOpen"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-if="mobileOpen" class="lg:hidden">
        <nav class="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-black/5 bg-white px-6 py-4" aria-label="Mobile">
          <ul class="divide-y divide-black/5">
            <li v-for="(item, i) in items" :key="i" class="py-1">
              <!-- Mega item → accordion -->
              <template v-if="item.hasMegaMenu">
                <button
                  type="button"
                  class="flex w-full items-center justify-between py-3 text-sm font-medium uppercase tracking-wide text-dark"
                  :aria-expanded="mobileExpanded === i"
                  @click="toggleMobileItem(i)"
                >
                  {{ item.label }}
                  <svg
                    class="h-4 w-4 transition-transform"
                    :class="{ 'rotate-180': mobileExpanded === i }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div v-if="mobileExpanded === i" class="pb-3 pl-3">
                  <div v-for="(col, ci) in item.columns ?? []" :key="ci" class="mb-3">
                    <NuxtLink
                      v-if="col.href"
                      :to="col.href"
                      class="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-muted"
                      @click="closeAll"
                    >{{ col.heading }}</NuxtLink>
                    <p v-else class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{{ col.heading }}</p>
                    <ul class="space-y-2">
                      <li v-for="(link, li) in col.links ?? []" :key="li">
                        <NuxtLink :to="link.href || '#'" class="block text-sm text-dark" @click="closeAll">
                          {{ link.label }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
              <!-- Plain link -->
              <NuxtLink
                v-else
                :to="item.href || '#'"
                class="block py-3 text-sm font-medium uppercase tracking-wide text-dark"
                @click="closeAll"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>

          <a
            v-if="cta"
            :href="cta.href || '#contact-section'"
            class="mt-4 inline-flex h-[50px] w-full items-center justify-center rounded-pill bg-accent px-6 text-base font-semibold text-dark"
            @click="closeAll"
          >
            {{ cta.label }}
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mega-enter-active,
.mega-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.mega-enter-from,
.mega-leave-to {
  opacity: 0;
  transform: translate(-50%, -6px);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
