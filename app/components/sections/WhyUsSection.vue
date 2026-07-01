<template>
  <section ref="sectionRef" class="relative overflow-hidden" aria-labelledby="why-heading">
    <div
      class="absolute inset-0 bg-[url('/services-page/auto-accidents/black-bg.webp')] bg-cover bg-center"
      aria-hidden="true"
    />

    <div class="site-container relative z-[1] flex flex-col gap-14 py-12 md:py-[60px] min-[1200px]:py-20">
      <!-- Centered header -->
      <div class="reveal mx-auto max-w-[780px] text-center">
        <h2
          id="why-heading"
          class="mb-5 font-primary text-[clamp(1.8rem,3vw,3.125rem)] font-bold leading-[1.15] text-white"
        >
          {{ data.heading.replace(data.headingAccent, "") }}
          <span class="text-accent">{{ data.headingAccent }}</span>
        </h2>
        <p class="text-base leading-[1.75] tracking-[-0.025em] text-white/[0.57]">{{ data.body1 }}</p>
      </div>

      <!-- Two-column body -->
      <div class="grid grid-cols-1 items-center gap-10 min-[1200px]:grid-cols-2 min-[1200px]:gap-16">
        <div class="reveal reveal-delay-1 flex flex-col gap-6">
          <p class="text-[clamp(1.2rem,2vw,1.6rem)] font-bold leading-[1.35] tracking-[-0.02em] text-muted">
            <span class="text-accent">{{ leadTyped }}</span><span
              class="why__cursor"
              :class="{ 'why__cursor--done': leadTypingDone }"
              aria-hidden="true"
            >|</span>{{ leadUntyped }}
          </p>
          <p class="text-[15px] leading-[1.75] tracking-[-0.025em] text-white">{{ data.body3 }}</p>
        </div>

        <div class="why__right">
          <div v-for="(row, r) in [[0, 1], [2, 3]]" :key="r" class="why__row">
            <button
              v-for="i in row"
              :key="i"
              class="why__feature"
              :class="{ 'is-open': open.has(i) }"
              @click="toggle(i)"
              :aria-expanded="open.has(i)"
            >
              <div class="why__feature-icon">
                <img
                  :src="open.has(i) ? data.features[i].iconGrey : data.features[i].iconYellow"
                  :alt="data.features[i].title"
                  width="64"
                  height="64"
                  loading="lazy"
                />
              </div>
              <div class="why__feature-text">
                <p class="why__feature-title">{{ data.features[i].title }}</p>
                <p class="why__feature-desc">{{ data.features[i].description }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({ data: { type: Object, required: true } });
const data = props.data as any;
const sectionRef = ref<HTMLElement | null>(null);
useRevealSection(sectionRef);

const open = ref<Set<number>>(new Set([1, 2]));

// Each row is a pair: [0,1] and [2,3]. Opening one always closes its partner.
function toggle(i: number) {
  const partner = i % 2 === 0 ? i + 1 : i - 1;
  const next = new Set(open.value);
  if (next.has(i)) {
    next.delete(i);
    next.add(partner);
  } else {
    next.add(i);
    next.delete(partner);
  }
  open.value = next;
  restartTimer();
}

let timer: ReturnType<typeof setInterval>;

function startTimer() {
  timer = setInterval(() => {
    open.value = open.value.has(1) ? new Set([0, 3]) : new Set([1, 2]);
  }, 5000);
}

function restartTimer() {
  clearInterval(timer);
  startTimer();
}

// ── Typewriter (lead paragraph) ─────────────────────────────────────────────
const typedCount = ref(0);
const leadTyped = computed(() => data.body2.slice(0, typedCount.value));
const leadUntyped = computed(() => data.body2.slice(typedCount.value));
const leadTypingDone = computed(() => typedCount.value >= data.body2.length);

let typingTimer: ReturnType<typeof setTimeout> | null = null;

function typeNext() {
  if (typedCount.value >= data.body2.length) return;
  typedCount.value++;
  typingTimer = setTimeout(typeNext, 20);
}

onMounted(() => {
  startTimer();
  const el = sectionRef.value;
  if (!el) return;
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        setTimeout(typeNext, 300);
        obs.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  obs.observe(el);
});

onUnmounted(() => {
  clearInterval(timer);
  if (typingTimer) clearTimeout(typingTimer);
});
</script>

<!-- Plain CSS (no SCSS): the feature-accordion width/reveal transitions + the
     typewriter cursor blink. $closed=140 $icon=64 $gap=16 $pad=20 resolved. -->
<style scoped>
.why__cursor {
  color: var(--color-accent);
  font-weight: 300;
  animation: cursor-blink 0.7s step-end infinite;
}
.why__cursor--done {
  animation: none;
  opacity: 0;
  transition: opacity 0.3s ease 0.4s;
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.why__right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.why__row {
  display: flex;
  gap: 16px;
  height: 140px;
}
.why__feature {
  flex: none;
  width: 140px;
  height: 140px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 20px;
  padding-left: 38px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    padding-left 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;
}
.why__feature:hover {
  border-color: rgba(255, 255, 255, 0.18);
}
.why__feature.is-open {
  width: calc(100% - 156px);
  padding-left: 20px;
  border-color: rgba(255, 255, 255, 0.14);
}
.why__feature-icon {
  flex-shrink: 0;
}
.why__feature-icon img {
  display: block;
  width: 64px;
  height: 64px;
  object-fit: contain;
}
.why__feature-text {
  overflow: hidden;
  opacity: 0;
  max-width: 0;
  flex-shrink: 0;
  transition: max-width 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease 0.18s;
}
.why__feature.is-open .why__feature-text {
  max-width: 280px;
  opacity: 1;
}
.why__feature-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-white);
  line-height: 1.4;
  white-space: nowrap;
  margin-bottom: 5px;
}
.why__feature-desc {
  font-size: 14px;
  color: white;
  line-height: 1.5;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .why__right {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .why__row {
    display: contents;
  }
  .why__feature {
    width: 100% !important;
    height: auto !important;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px !important;
    gap: 12px;
    transition: none;
  }
  .why__feature.is-open {
    width: 100% !important;
    padding-left: 20px !important;
  }
  .why__feature-icon img {
    width: 40px;
    height: 40px;
  }
  .why__feature-text {
    max-width: none !important;
    opacity: 1 !important;
    transition: none;
    overflow: visible;
  }
  .why__feature-title {
    white-space: normal;
    font-size: 14px;
  }
  .why__feature-desc {
    white-space: normal;
    font-size: 13px;
  }
}
</style>
