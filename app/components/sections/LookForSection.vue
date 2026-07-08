<script setup lang="ts">
interface Bullet { text?: string | null }
interface Cta { label?: string | null; href?: string | null; variant?: string | null }
interface Block {
  heading?: string | null
  preferredTitle?: string | null
  preferred?: Bullet[] | null
  mustHavesTitle?: string | null
  mustHaves?: Bullet[] | null
  cta?: Cta | null
}

defineProps<{
  block: Block | null | undefined
  image?: string | null
}>()
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <h2 class="text-center font-secondary text-[clamp(1.8rem,3.5vw,3.125rem)] font-semibold leading-[1.12] text-dark">{{ block.heading }}</h2>

      <div class="mt-12 grid items-center gap-8 lg:grid-cols-2 3xl:mt-16 3xl:gap-12">
        <!-- Image -->
        <div class="overflow-hidden rounded-3xl">
          <img
            v-if="image"
            :src="image"
            :alt="block.heading || ''"
            class="h-full min-h-[320px] w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <!-- Lists -->
        <div class="flex flex-col gap-6">
          <!-- Preferred -->
          <div class="rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] 3xl:p-8">
            <h3 class="mb-5 font-secondary text-xl font-bold text-dark">{{ block.preferredTitle }}</h3>
            <ul class="flex flex-col gap-3.5">
              <li v-for="(b, i) in block.preferred ?? []" :key="i" class="flex items-center gap-3 font-primary text-[15px] text-dark/80">
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
                {{ b.text }}
              </li>
            </ul>
          </div>

          <!-- Must-Haves -->
          <div class="rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] 3xl:p-8">
            <h3 class="mb-5 font-secondary text-xl font-bold text-dark">{{ block.mustHavesTitle }}</h3>
            <ul class="flex flex-col gap-3.5">
              <li v-for="(b, i) in block.mustHaves ?? []" :key="i" class="flex items-center gap-3 font-primary text-[15px] text-dark/80">
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a]/15 text-[#16a34a]">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {{ b.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="block.cta?.label" class="mt-10 flex justify-center 3xl:mt-12">
        <BaseButton :href="block.cta.href" :variant="block.cta.variant || 'primary'">
          {{ block.cta.label }}
          <img src="/icons/arrow-next.svg" alt="" class="h-[18px] w-[18px]" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>
