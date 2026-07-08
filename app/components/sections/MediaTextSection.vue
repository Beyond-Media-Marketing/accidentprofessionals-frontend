<script setup lang="ts">
interface MediaText {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  body?: string | null
  cta?: any
  ctaSecondary?: any
  highlightTitle?: string | null
  highlightText?: string | null
  layout?: 'image-left' | 'image-right' | 'stacked' | null
  theme?: 'light' | 'dark' | null
}

const props = defineProps<{
  block: MediaText | null | undefined
  image?: string | null
  imageAlt?: string | null
  /** Icon shown in the gold highlight strip (defaults to the vetted-network badge). */
  highlightIcon?: string | null
}>()

const isDark = computed(() => props.block?.theme === 'dark')
const layout = computed(() => props.block?.layout || 'image-left')
// On a light media-text the secondary CTA renders as the white/black outline
// button (regardless of the variant stored in the CMS). Dark sections keep theirs.
const secondaryCta = computed(() => {
  const c = props.block?.ctaSecondary
  if (!c) return null
  return isDark.value ? c : { ...c, variant: 'outline' }
})
const stacked = computed(() => layout.value === 'stacked')
const imageRight = computed(() => layout.value === 'image-right')
</script>

<template>
  <section v-if="block" class="relative">
    <!-- ===== Stacked: centered header on a dark/light band + horizontal image straddling the bottom ===== -->
    <template v-if="stacked">
      <div
        class="pb-[190px] pt-16 md:pb-[258px] lg:pb-[334px] 3xl:pt-24"
        :class="isDark ? 'bg-dark text-on-dark' : 'bg-cream'"
      >
        <div class="site-container">
          <SectionHeader
            :eyebrow="block.eyebrow"
            :heading="block.heading"
            :heading-accent="block.headingAccent"
            :intro="block.body"
            :cta="block.cta"
            :secondary-cta="secondaryCta"
            align="center"
            :theme="isDark ? 'dark' : 'light'"
          />
        </div>
      </div>
      <!-- Image pulled up by half its height: top half over the band, bottom half on the page bg.
           The band's extra bottom padding (vs the -mt) creates breathing room between the CTA and the image. -->
      <div v-if="image" class="site-container">
        <img
          :src="image"
          :alt="imageAlt || block.heading || ''"
          class="relative z-10 -mt-[150px] block h-[300px] w-full rounded-3xl object-cover md:-mt-[210px] md:h-[420px] lg:-mt-[270px] lg:h-[540px]"
          loading="lazy"
          decoding="async"
        />
      </div>
    </template>

    <!-- ===== Side-by-side: image (with highlight strip) + content ===== -->
    <div v-else class="section" :class="isDark ? 'bg-dark text-on-dark' : 'bg-cream'">
      <div class="site-container">
        <div class="grid items-center gap-10 lg:grid-cols-2 3xl:gap-16">
          <div class="relative" :class="imageRight ? 'lg:order-2' : ''">
            <div class="aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[5/4] lg:aspect-square">
              <img
                v-if="image"
                :src="image"
                :alt="imageAlt || block.heading || ''"
                class="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <!-- Highlight strip (gold glass) -->
            <div
              v-if="block.highlightTitle"
              class="media-highlight absolute bottom-5 left-5 right-5 rounded-3xl px-6 py-6 backdrop-blur-[50px] sm:right-auto sm:max-w-[470px] lg:-left-4"
            >
              <div class="flex items-center gap-5">
                <img
                  :src="highlightIcon || '/icons/vetted-network.svg'"
                  alt=""
                  class="h-12 w-12 shrink-0 3xl:h-14 3xl:w-14"
                  aria-hidden="true"
                />
                <div>
                  <p class="font-primary text-lg font-semibold text-white">{{ block.highlightTitle }}</p>
                  <p class="mt-1.5 font-primary text-sm leading-relaxed text-white">{{ block.highlightText }}</p>
                </div>
              </div>
            </div>
          </div>

          <SectionHeader
            :class="imageRight ? 'lg:order-1' : ''"
            :eyebrow="block.eyebrow"
            :heading="block.heading"
            :heading-accent="block.headingAccent"
            :intro="block.body"
            :cta="block.cta"
            :secondary-cta="secondaryCta"
            align="left"
            :theme="isDark ? 'dark' : 'light'"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Gold-glass highlight strip (same fill as the homepage "goal is simple" card). */
.media-highlight {
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)),
    rgba(243, 175, 0, 0.24);
}
</style>
