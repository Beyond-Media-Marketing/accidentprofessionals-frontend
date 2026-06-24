<script setup lang="ts">
interface FaqItem {
  question?: string | null
  answer?: string | null
}
interface Faq {
  heading?: string | null
  intro?: string | null
  items?: FaqItem[] | null
}

const props = defineProps<{ block: Faq | null | undefined }>()

// First item open by default.
const openIndex = ref(0)
const toggle = (i: number) => (openIndex.value = openIndex.value === i ? -1 : i)

useFaqJsonLd(() => props.block?.items)
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <div class="mx-auto max-w-[1040px]">
        <h2 class="text-center font-secondary font-semibold leading-[1.12] text-dark text-[clamp(1.8rem,3.5vw,3.125rem)]">
          {{ block.heading }}
        </h2>
        <p v-if="block.intro" class="mt-3 text-center font-primary text-base leading-relaxed text-muted">
          {{ block.intro }}
        </p>

        <div class="mt-10 flex flex-col gap-4 3xl:mt-12">
          <div
            v-for="(item, i) in block.items ?? []"
            :key="i"
            class="overflow-hidden rounded-2xl bg-white"
          >
            <button
              class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:px-8 lg:py-6"
              :aria-expanded="openIndex === i"
              @click="toggle(i)"
            >
              <span
                class="font-primary text-lg font-semibold transition-colors"
                :class="openIndex === i ? 'text-accent' : 'text-dark'"
              >
                {{ item.question }}
              </span>
              <svg
                class="h-5 w-5 shrink-0 text-accent transition-transform duration-300"
                :class="openIndex === i ? 'rotate-90' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>

            <div
              class="grid transition-all duration-300 ease-out"
              :class="openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
                <p class="px-6 pb-6 font-primary text-base leading-relaxed text-muted lg:px-8">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
