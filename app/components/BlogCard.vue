<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ post: any; featured?: boolean }>()

const catPath = computed(() => {
  const c = props.post?.category
  if (!c?.slug) return 'uncategorized'
  return c.parent?.slug ? `${c.parent.slug}/${c.slug}` : c.slug
})
const link = computed(() => `/blogs/${catPath.value}/${props.post?.slug}`)
const cover = computed(() =>
  strapiMedia(props.post?.coverImage, props.post?.coverUrl || '/homepage/homepage-hero.png'),
)
const date = computed(() =>
  props.post?.publishedDate
    ? new Date(props.post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '',
)
</script>

<template>
  <NuxtLink
    :to="link"
    class="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04] transition-all hover:-translate-y-1 hover:shadow-card"
    :class="featured ? 'sm:flex-row' : ''"
  >
    <!-- Cover -->
    <div class="relative overflow-hidden" :class="featured ? 'sm:w-[54%]' : ''">
      <div :class="featured ? 'aspect-[16/10] h-full sm:aspect-auto' : 'aspect-[16/10]'">
        <img :src="cover" :alt="post?.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
      </div>
      <span
        v-if="post?.category?.name"
        class="absolute left-4 top-4 rounded-full bg-dark/75 px-3 py-1 font-primary text-xs font-semibold text-white backdrop-blur-sm"
      >{{ post.category.name }}</span>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col p-6 3xl:p-7" :class="featured ? 'sm:justify-center sm:p-8 3xl:p-10' : ''">
      <p v-if="date" class="mb-3 font-primary text-xs font-medium uppercase tracking-wide text-muted">{{ date }}</p>
      <h3
        class="font-secondary font-bold leading-snug text-dark transition-colors group-hover:text-accent"
        :class="featured ? 'text-2xl 3xl:text-[28px]' : 'text-lg'"
      >{{ post?.title }}</h3>
      <p
        v-if="post?.excerpt"
        class="mt-3 font-primary text-sm leading-relaxed text-muted"
        :class="featured ? 'line-clamp-3 3xl:text-base' : 'line-clamp-2'"
      >{{ post.excerpt }}</p>
      <span class="mt-5 inline-flex items-center gap-1.5 font-primary text-sm font-semibold text-accent">
        Read article
        <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </span>
    </div>
  </NuxtLink>
</template>
