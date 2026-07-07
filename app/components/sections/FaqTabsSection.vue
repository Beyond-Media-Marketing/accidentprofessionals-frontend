<script setup lang="ts">
import { ref, computed } from 'vue'

interface FaqItem { question?: string | null; answer?: string | null }
interface Block {
  heading?: string | null
  clientLabel?: string | null
  attorneyLabel?: string | null
  clientFaqs?: FaqItem[] | null
  attorneyFaqs?: FaqItem[] | null
}

const props = defineProps<{ block: Block | null | undefined }>()

const tab = ref<'client' | 'attorney'>('client')
const openIndex = ref(0)

const items = computed<FaqItem[]>(() =>
  (tab.value === 'client' ? props.block?.clientFaqs : props.block?.attorneyFaqs) ?? [],
)

function setTab(t: 'client' | 'attorney') {
  tab.value = t
  openIndex.value = 0
}
const toggle = (i: number) => (openIndex.value = openIndex.value === i ? -1 : i)

// Emit FAQ schema for whichever set is active.
useFaqJsonLd(() => items.value)
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <div class="mx-auto max-w-[1040px]">
        <h2 class="text-center font-secondary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.12] text-dark">{{ block.heading }}</h2>

        <!-- Toggle -->
        <div class="mx-auto mt-8 grid max-w-[640px] grid-cols-2 gap-2 rounded-pill bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            class="rounded-pill py-3 font-primary text-sm font-semibold transition-colors"
            :class="tab === 'client' ? 'bg-accent text-white' : 'text-muted hover:text-dark'"
            @click="setTab('client')"
          >{{ block.clientLabel }}</button>
          <button
            type="button"
            class="rounded-pill py-3 font-primary text-sm font-semibold transition-colors"
            :class="tab === 'attorney' ? 'bg-accent text-white' : 'text-muted hover:text-dark'"
            @click="setTab('attorney')"
          >{{ block.attorneyLabel }}</button>
        </div>

        <!-- Accordion -->
        <div class="mt-8 flex flex-col gap-4">
          <div v-for="(item, i) in items" :key="`${tab}-${i}`" class="overflow-hidden rounded-2xl bg-white">
            <button
              class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:px-8 lg:py-6"
              :aria-expanded="openIndex === i"
              @click="toggle(i)"
            >
              <span class="font-primary text-base font-semibold transition-colors lg:text-lg" :class="openIndex === i ? 'text-accent' : 'text-dark'">{{ item.question }}</span>
              <svg
                class="h-5 w-5 shrink-0 text-accent transition-transform duration-300"
                :class="openIndex === i ? 'rotate-90' : ''"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <Transition name="faq">
              <div v-if="openIndex === i" class="px-6 pb-6 lg:px-8">
                <p class="font-primary text-[15px] leading-[1.7] text-muted">{{ item.answer }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-enter-active, .faq-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.faq-enter-from, .faq-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
