<script setup lang="ts">
import qs from 'qs'
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: 'site' })

const route = useRoute()
const { strapiUrl, siteUrl } = useRuntimeConfig().public
const segs = computed<string[]>(() => (route.params.path as string[]) || [])

const catPopulate = { fields: ['name', 'slug'], populate: { parent: { fields: ['name', 'slug'] } } }
const cardPopulate = { coverImage: true, category: catPopulate }

const { data } = await useAsyncData(`blogs-${segs.value.join('/')}`, async () => {
  const s = segs.value
  const last = s[s.length - 1]

  const getCat = async (slug: string) =>
    (await $fetch<any>(`${strapiUrl}/api/blog-categories?${qs.stringify({ filters: { slug: { $eq: slug } }, populate: { parent: { fields: ['name', 'slug'] }, seo: { populate: '*' } } }, { encodeValuesOnly: true })}`).catch(() => null))?.data?.[0] ?? null
  const getPost = async (slug: string) =>
    (await $fetch<any>(`${strapiUrl}/api/blog-posts?${qs.stringify({ filters: { slug: { $eq: slug } }, populate: { coverImage: true, category: catPopulate, midCta: { populate: { cta: true } }, endCta: { populate: { cta: true } }, faq: { populate: { items: true } }, seo: { populate: '*' } } }, { encodeValuesOnly: true })}`).catch(() => null))?.data?.[0] ?? null

  const catsAll = (await $fetch<any>(`${strapiUrl}/api/blog-categories?${qs.stringify({ sort: ['order:asc', 'name:asc'], populate: { parent: { fields: ['slug'] } }, pagination: { pageSize: 100 } }, { encodeValuesOnly: true })}`).catch(() => null))?.data ?? []

  let mode = 'post', post: any = null, category: any = null
  if (s.length === 1) {
    category = await getCat(last); mode = 'category'
  } else if (s.length === 2) {
    const child = await getCat(last)
    if (child && child.parent?.slug === s[0]) { category = child; mode = 'category' }
    else { post = await getPost(last); mode = 'post' }
  } else {
    post = await getPost(last); mode = 'post'
  }

  let posts: any[] = [], related: any[] = []
  if (mode === 'category' && category) {
    // A parent category includes its own posts + those of its child categories.
    const childSlugs = catsAll.filter((c: any) => c.parent?.slug === category.slug).map((c: any) => c.slug)
    const slugSet = [category.slug, ...childSlugs]
    posts = (await $fetch<any>(`${strapiUrl}/api/blog-posts?${qs.stringify({ filters: { category: { slug: { $in: slugSet } } }, sort: ['publishedDate:desc'], populate: cardPopulate, pagination: { pageSize: 100 } }, { encodeValuesOnly: true })}`).catch(() => null))?.data ?? []
  }
  if (mode === 'post' && post) {
    related = (await $fetch<any>(`${strapiUrl}/api/blog-posts?${qs.stringify({ filters: { category: { slug: { $eq: post.category?.slug } }, slug: { $ne: post.slug } }, sort: ['publishedDate:desc'], populate: cardPopulate, pagination: { pageSize: 3 } }, { encodeValuesOnly: true })}`).catch(() => null))?.data ?? []
  }
  return { mode, post, category, posts, related, cats: catsAll }
})

const mode = computed(() => data.value?.mode)
const post = computed<any>(() => data.value?.post ?? null)
const category = computed<any>(() => data.value?.category ?? null)
const posts = computed<any[]>(() => data.value?.posts ?? [])
const related = computed<any[]>(() => data.value?.related ?? [])
const cats = computed<any[]>(() => data.value?.cats ?? [])

if ((mode.value === 'post' && !post.value) || (mode.value === 'category' && !category.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

const catPathOf = (c: any) => (!c?.slug ? '' : c.parent?.slug ? `${c.parent.slug}/${c.slug}` : c.slug)

// ── Post view helpers ──
const cover = computed(() => strapiMedia(post.value?.coverImage, post.value?.coverUrl || '/homepage/homepage-hero.png'))
const date = computed(() => post.value?.publishedDate ? new Date(post.value.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '')
const toc = computed(() => tocFromHtml(`${addHeadingIds(post.value?.content)}${addHeadingIds(post.value?.contentTwo)}`))
const readingTime = computed(() => {
  const text = `${post.value?.content || ''} ${post.value?.contentTwo || ''}`.replace(/<[^>]+>/g, ' ')
  return Math.max(1, Math.round((text.split(/\s+/).filter(Boolean).length) / 200))
})
const postUrl = computed(() => `/blogs/${catPathOf(post.value?.category)}/${post.value?.slug}`)
const canonical = computed(() => post.value?.seo?.canonicalUrl || `${siteUrl}${postUrl.value}/`)

usePageSeo(() => (mode.value === 'post' ? post.value?.seo : category.value?.seo))
useHead(() => ({ title: (mode.value === 'post' ? post.value?.seo?.metaTitle || `${post.value?.title} — AP Blog` : category.value?.seo?.metaTitle || `${category.value?.name} — AP Blog`) }))
useHead({
  script: computed(() => mode.value !== 'post' || !post.value ? [] : [
    { type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.value.title, image: cover.value, datePublished: post.value.publishedDate, dateModified: post.value.updatedAt || post.value.publishedDate, author: { '@type': 'Organization', name: post.value.author || 'Accident Professionals' }, publisher: { '@type': 'Organization', name: 'Accident Professionals' }, mainEntityOfPage: canonical.value }) },
  ]) as any,
})

// Reading progress + active TOC
const progress = ref(0)
const activeId = ref('')
let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    const doc = document.documentElement
    const total = doc.scrollHeight - doc.clientHeight
    progress.value = total > 0 ? Math.min(100, (doc.scrollTop / total) * 100) : 0
    let cur = ''
    for (const h of toc.value) { const el = document.getElementById(h.id); if (el && el.getBoundingClientRect().top <= 120) cur = h.id }
    activeId.value = cur
  })
}
onMounted(() => { if (mode.value === 'post') { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() } })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div>
    <!-- ============ CATEGORY LISTING ============ -->
    <template v-if="mode === 'category' && category">
      <section class="bg-dark text-on-dark">
        <div class="site-container py-14 text-center lg:py-16 3xl:py-20">
          <nav class="mb-5 font-primary text-sm text-white/50">
            <NuxtLink to="/blogs" class="transition-colors hover:text-accent">Blog</NuxtLink>
            <template v-if="category.parent">
              <span class="px-2">/</span>
              <NuxtLink :to="`/blogs/${category.parent.slug}`" class="transition-colors hover:text-accent">{{ category.parent.name }}</NuxtLink>
            </template>
            <span class="px-2">/</span><span class="text-white/80">{{ category.name }}</span>
          </nav>
          <h1 class="font-secondary text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1]">{{ category.name }}</h1>
          <p v-if="category.description" class="mx-auto mt-4 max-w-[620px] font-primary text-[15px] leading-[1.7] text-white/70">{{ category.description }}</p>
        </div>
      </section>

      <section class="section bg-cream">
        <div class="site-container">
          <div class="mb-10 flex flex-wrap justify-center gap-2.5 3xl:mb-14">
            <NuxtLink to="/blogs" class="rounded-pill border border-dark/10 bg-white px-5 py-2.5 font-primary text-sm font-semibold text-dark transition-colors hover:border-accent hover:text-accent">All Posts</NuxtLink>
            <NuxtLink v-for="c in cats.filter((x:any) => !x.parent)" :key="c.slug" :to="`/blogs/${c.slug}`" class="rounded-pill px-5 py-2.5 font-primary text-sm font-semibold transition-colors" :class="c.slug === category.slug || c.slug === category.parent?.slug ? 'bg-dark text-white' : 'border border-dark/10 bg-white text-dark hover:border-accent hover:text-accent'">{{ c.name }}</NuxtLink>
          </div>
          <div v-if="posts.length" class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <BlogCard v-for="p in posts" :key="p.slug" :post="p" />
          </div>
          <p v-else class="py-16 text-center font-primary text-muted">No posts in this category yet.</p>
        </div>
      </section>
    </template>

    <!-- ============ POST ============ -->
    <template v-else-if="post">
      <div class="fixed inset-x-0 top-0 z-50 h-1 bg-transparent"><div class="h-full bg-accent transition-[width] duration-150" :style="{ width: `${progress}%` }" /></div>

      <!-- Cover hero with overlaid content -->
      <section class="relative isolate flex min-h-[62vh] items-end overflow-hidden sm:min-h-[72vh]">
        <img :src="cover" :alt="post.title" class="absolute inset-0 -z-10 h-full w-full object-cover" loading="eager" />
        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-dark/85 via-dark/35 to-dark/10" />
        <div class="site-container w-full pb-12 pt-40 text-on-dark 3xl:pb-16">
          <nav class="mb-5 font-primary text-sm text-white/60">
            <NuxtLink to="/blogs" class="transition-colors hover:text-accent">Blog</NuxtLink>
            <template v-if="post.category?.parent">
              <span class="px-2">/</span>
              <NuxtLink :to="`/blogs/${post.category.parent.slug}`" class="transition-colors hover:text-accent">{{ post.category.parent.name }}</NuxtLink>
            </template>
            <span class="px-2">/</span>
            <NuxtLink :to="`/blogs/${catPathOf(post.category)}`" class="transition-colors hover:text-accent">{{ post.category?.name }}</NuxtLink>
            <span class="px-2">/</span><span class="text-white/80">{{ post.title }}</span>
          </nav>
          <div class="max-w-[880px]">
            <NuxtLink v-if="post.category" :to="`/blogs/${catPathOf(post.category)}`" class="inline-block rounded-full bg-accent/20 px-3 py-1 font-primary text-xs font-semibold uppercase tracking-wide text-accent backdrop-blur-sm">{{ post.category.name }}</NuxtLink>
            <h1 class="mt-4 font-secondary text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">{{ post.title }}</h1>
            <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-primary text-sm text-white/75">
              <span v-if="date">{{ date }}</span>
              <span>{{ readingTime }} min read</span>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-cream pb-16 pt-12 3xl:pb-24 3xl:pt-16">
        <div class="site-container">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
            <article class="min-w-0 max-w-[760px]">
              <ProseHtml :html="post.content" />
              <BlogCtaBlock :block="post.midCta" />
              <ProseHtml v-if="post.contentTwo" :html="post.contentTwo" />

              <BlogCtaBlock :block="post.endCta" dark />

              <div v-if="post.faq?.items?.length" class="mt-12">
                <h2 class="mb-6 font-secondary text-2xl font-bold text-dark 3xl:text-3xl">{{ post.faq.heading || 'Frequently Asked Questions' }}</h2>
                <div class="flex flex-col gap-3">
                  <details v-for="(item, i) in post.faq.items" :key="i" class="group overflow-hidden rounded-2xl bg-white">
                    <summary class="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-primary text-base font-semibold text-dark marker:content-none">
                      {{ item.question }}
                      <svg class="h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </summary>
                    <p class="px-6 pb-5 font-primary text-[15px] leading-relaxed text-muted">{{ item.answer }}</p>
                  </details>
                </div>
              </div>
            </article>

            <aside v-if="toc.length" class="hidden lg:block">
              <div class="sticky top-24">
                <p class="mb-4 font-primary text-xs font-semibold uppercase tracking-wider text-muted">On this page</p>
                <nav class="flex flex-col gap-2.5 border-l border-dark/10 pl-4">
                  <a v-for="h in toc" :key="h.id" :href="`#${h.id}`" class="font-primary text-sm leading-snug transition-colors" :class="activeId === h.id ? 'font-semibold text-accent' : 'text-muted hover:text-dark'">{{ h.text }}</a>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section v-if="related.length" class="section bg-white">
        <div class="site-container">
          <h2 class="mb-10 font-secondary text-2xl font-bold text-dark sm:text-3xl 3xl:mb-12">Related articles</h2>
          <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <BlogCard v-for="p in related" :key="p.slug" :post="p" />
          </div>
        </div>
      </section>
    </template>

    <PageBottom />
  </div>
</template>
