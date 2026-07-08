<script setup lang="ts">
import { ref, computed } from 'vue'

interface Item {
  icon?: string | null
  title?: string | null
  description?: string | null
}
interface Tab {
  label?: string | null
  items?: Item[] | null
}
interface Damages {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  intro?: string | null
  tabs?: Tab[] | null
  disclaimer?: string | null
  cta?: { label?: string | null; href?: string | null } | null
}
const props = defineProps<{ block: Damages | null | undefined }>()

const tabs = computed<Tab[]>(() => props.block?.tabs ?? [])
const active = ref(0)
const activeItems = computed<Item[]>(() => tabs.value[active.value]?.items ?? [])

// Gold line-icons keyed by the CMS `icon` name (fallback: shield).
const icons: Record<string, string> = {
  medical: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/>',
  wallet: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M16 14h2"/>',
  car: '<path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M5 11h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"/><circle cx="7.5" cy="16.5" r="1"/><circle cx="16.5" cy="16.5" r="1"/>',
  pulse: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  dollar: '<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  scales: '<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z"/>',
  home: '<path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
}
const iconPath = (name?: string | null) => icons[name || 'shield'] || icons.shield

// These icons are served from uploaded SVG files instead of the inline set.
const FILE_ICONS = new Set(['medical', 'wallet', 'car', 'pulse'])
const fileIcon = (name?: string | null) => (name && FILE_ICONS.has(name) ? `/icons/${name}.svg` : null)
</script>

<template>
  <section v-if="block" class="section bg-dark">
    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :heading-accent="block.headingAccent"
        :intro="block.intro"
        align="center"
        theme="dark"
      />

      <!-- Functional tab toggle -->
      <div
        v-if="tabs.length > 1"
        class="mx-auto mt-10 flex max-w-[760px] overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1"
        role="tablist"
      >
        <button
          v-for="(tab, ti) in tabs"
          :key="ti"
          type="button"
          role="tab"
          :aria-selected="active === ti"
          class="flex-1 rounded-lg px-6 py-3 text-center font-primary text-sm font-semibold transition-colors"
          :class="active === ti ? 'bg-accent text-dark' : 'text-white/60 hover:text-white'"
          @click="active = ti"
        >
          {{ tab.label }}
        </button>
      </div>

      <Transition name="dmg" mode="out-in">
        <div :key="active" class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <article
            v-for="(item, i) in activeItems"
            :key="i"
            class="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <span class="shrink-0 text-accent">
              <img v-if="fileIcon(item.icon)" :src="fileIcon(item.icon)!" alt="" class="h-7 w-7 object-contain" loading="lazy" />
              <svg v-else class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="iconPath(item.icon)" />
            </span>
            <div>
              <h3 class="font-primary text-lg font-semibold text-white">{{ item.title }}</h3>
              <p class="mt-1.5 font-primary text-sm leading-relaxed text-white/55">{{ item.description }}</p>
            </div>
          </article>
        </div>
      </Transition>

      <p v-if="block.disclaimer" class="mx-auto mt-8 max-w-[720px] text-center font-primary text-xs leading-relaxed text-white/40">
        {{ block.disclaimer }}
      </p>

      <div v-if="block.cta?.label" class="mt-8 flex justify-center">
        <NuxtLink
          :to="block.cta.href || '#'"
          class="inline-flex items-center gap-2 rounded-pill border border-white/25 px-7 py-3 font-primary text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
        >
          {{ block.cta.label }}
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dmg-enter-active,
.dmg-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dmg-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.dmg-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
