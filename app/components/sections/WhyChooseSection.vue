<script setup lang="ts">
interface Item {
  title?: string | null
  description?: string | null
}
interface WhyChoose {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  intro?: string | null
  image?: string | null
  items?: Item[] | null
}
defineProps<{ block: WhyChoose | null | undefined }>()
</script>

<template>
  <section v-if="block" class="section bg-dark pb-0">
    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :heading-accent="block.headingAccent"
        :intro="block.intro"
        align="center"
        theme="dark"
      />

      <div class="mt-12 grid gap-5 md:grid-cols-2 3xl:mt-16">
        <article
          v-for="(item, i) in block.items ?? []"
          :key="i"
          class="rounded-2xl border border-white/10 bg-white/[0.04] p-7 3xl:p-8"
        >
          <h3 class="font-primary text-lg font-semibold leading-snug text-white">{{ item.title }}</h3>
          <p class="mt-2.5 font-primary text-sm leading-relaxed text-white/55">{{ item.description }}</p>
        </article>
      </div>

      <div v-if="strapiMedia(block.image)" class="mt-12 overflow-hidden rounded-3xl 3xl:mt-16">
        <img :src="strapiMedia(block.image)" alt="" class="h-[300px] w-full object-cover md:h-[440px] lg:h-[520px]" loading="lazy" decoding="async" />
      </div>
    </div>
  </section>
</template>
