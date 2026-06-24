<script setup lang="ts">
interface Step {
  number?: string | null
  title?: string | null
  description?: string | null
}
interface StepsRow {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  cta?: any
  steps?: Step[] | null
}

const props = defineProps<{ block: StepsRow | null | undefined }>()
const steps = computed<Step[]>(() => props.block?.steps ?? [])

// Desktop (md+) only: auto-advancing accordion. On mobile every card is open
// (no animation, no loader) — handled via responsive classes + a guarded timer.
const active = ref(0)
const INTERVAL = 5000
let timer: ReturnType<typeof setInterval> | null = null

function stop() {
  if (timer) clearInterval(timer)
  timer = null
}
function start() {
  stop()
  if (!import.meta.client || steps.value.length < 2) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(max-width: 767px)').matches) return // no animation on mobile
  timer = setInterval(() => {
    active.value = (active.value + 1) % steps.value.length
  }, INTERVAL)
}
function select(i: number) {
  active.value = i
  start()
}

onMounted(() => {
  start()
  window.addEventListener('resize', start)
})
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('resize', start)
})
</script>

<template>
  <section v-if="block" class="section bg-white">
    <div class="site-container">
      <!-- Two-column header: heading/cta left, body right -->
      <div class="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
        <SectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :cta="block.cta" align="left" />
        <div
          v-if="block.body"
          class="steps-body font-primary text-base leading-relaxed text-muted lg:pt-2"
          v-html="renderInlineMarkdown(block.body)"
        />
      </div>

      <!-- Accordion (desktop) / stacked open cards (mobile) -->
      <div class="mt-12 flex flex-col gap-5 md:flex-row 3xl:mt-16" @mouseenter="stop" @mouseleave="start">
        <article
          v-for="(s, i) in steps"
          :key="i"
          class="step-card flex min-h-[200px] flex-col rounded-2xl bg-[#F7F2E9] p-7 transition-[flex-grow,flex-basis] duration-500 ease-out md:min-h-[260px] md:cursor-pointer 3xl:p-8"
          :class="[active === i ? 'is-active md:flex-[2.4]' : 'md:flex-1']"
          :aria-expanded="active === i"
          @click="select(i)"
        >
          <p class="step-num font-primary text-sm font-semibold text-dark/40">{{ s.number }}</p>

          <h3 class="step-title mt-4 font-primary text-lg font-semibold leading-snug text-dark 3xl:text-xl">
            {{ s.title }}
          </h3>

          <!-- Divider + description: always visible on mobile; on desktop only when active -->
          <div :class="active !== i ? 'md:hidden' : ''">
            <div class="step-divider my-4 h-px w-full bg-black/10" />
            <p class="step-desc font-primary text-sm leading-relaxed text-muted">{{ s.description }}</p>
          </div>

          <!-- Loader: desktop + closed only -->
          <span class="step-loader mt-6 hidden" :class="active !== i ? 'md:inline-block' : ''" aria-hidden="true" />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps-body :deep(strong) {
  color: var(--color-dark);
  font-weight: 600;
}

/* Spinning gold loader (closed cards, desktop only). */
.step-loader {
  height: 28px;
  width: 28px;
  border-radius: 9999px;
  border: 3px solid rgba(243, 175, 0, 0.25);
  border-top-color: #f3af00;
  animation: step-spin 0.8s linear infinite;
}
@keyframes step-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .step-loader {
    animation: none;
  }
}

/* Active (open) card styling — desktop only; on mobile all cards stay light + open. */
@media (min-width: 768px) {
  .is-active {
    background:
      linear-gradient(180deg, rgba(243, 175, 0, 0.7), rgba(243, 175, 0, 0.5)),
      #a8a197;
  }
  .is-active .step-num {
    color: rgba(255, 255, 255, 0.7);
  }
  .is-active .step-title {
    color: #ffffff;
  }
  .is-active .step-divider {
    background: rgba(255, 255, 255, 0.3);
  }
  .is-active .step-desc {
    color: rgba(255, 255, 255, 0.85);
  }
}
</style>
