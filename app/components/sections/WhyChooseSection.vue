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
  <section v-if="block" class="relative">
    <!-- Dark band: header + cards, with extra bottom padding for the image to straddle. -->
    <div class="bg-dark pt-16 3xl:pt-24" :class="strapiMedia(block.image) ? 'pb-[190px] md:pb-[258px] lg:pb-[334px]' : 'pb-16 3xl:pb-24'">
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
      </div>
    </div>

    <!-- Image pulled up by half its height: top half over the dark band, bottom half on the page bg. -->
    <div v-if="strapiMedia(block.image)" class="site-container">
      <img
        :src="strapiMedia(block.image)"
        alt=""
        class="relative z-10 -mt-[150px] block h-[300px] w-full rounded-3xl object-cover md:-mt-[210px] md:h-[420px] lg:-mt-[270px] lg:h-[540px]"
        loading="lazy"
        decoding="async"
      />
    </div>
  </section>
</template>
