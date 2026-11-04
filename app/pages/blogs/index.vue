<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ layout: "site" });

const { locale, t } = useI18n();

const postsQuery = {
  sort: ["publishedDate:desc", "createdAt:desc"],
  // Cards only need these scalars. Without an explicit `fields` list Strapi
  // also returns `content`/`contentTwo` — the full article HTML of every post —
  // which gets serialised into the hydration payload for no reason.
  fields: [
    "title",
    "slug",
    "excerpt",
    "publishedDate",
    "coverUrl",
    "featured",
  ],
  populate: {
    // `strapiMedia()` only reads `.url`; nothing renders the responsive
    // `formats` variants, so don't ship them.
    coverImage: { fields: ["url", "alternativeText", "updatedAt"] },
    category: {
      fields: ["name", "slug"],
      populate: { parent: { fields: ["name", "slug"] } },
    },
  },
  pagination: { pageSize: 100 },
};
const catsQuery = {
  sort: ["order:asc", "name:asc"],
  fields: ["name", "slug"],
  filters: { parent: { id: { $null: true } } },
  pagination: { pageSize: 100 },
};

const { data } = await useAsyncData(`blogs-index-${locale.value}`, async () => {
  const [postsRes, catsRes] = await Promise.all([
    strapiGet("blog-posts", postsQuery, locale.value),
    strapiGet("blog-categories", catsQuery, locale.value),
  ]);
  return { posts: postsRes?.data ?? [], categories: catsRes?.data ?? [] };
});

const posts = computed<any[]>(() => data.value?.posts ?? []);
const categories = computed<any[]>(() => data.value?.categories ?? []);
const featured = computed(
  () => posts.value.find((p) => p.featured) ?? posts.value[0] ?? null
);
const rest = computed(() =>
  posts.value.filter((p) => p.slug !== featured.value?.slug)
);

// Routed through usePageSeo so this page also gets a canonical, Open Graph and
// Twitter Card tags, and the global default OG image — it previously emitted a
// title and description only.
usePageSeo(() => ({
  metaTitle: t("blog.metaTitle"),
  metaDescription: t("blog.metaDescription"),
}));
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-dark text-on-dark">
      <div class="site-container py-16 text-center 3xl:py-20">
        <h1
          class="font-secondary text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.08]"
        >
          {{ $t("blog.heading") }} <span class="text-accent">{{ $t("blog.headingAccent") }}</span>
        </h1>
        <p
          class="mx-auto mt-5 max-w-[640px] font-primary text-[15px] leading-[1.7] text-white/70 3xl:text-base"
        >
          {{ $t("blog.intro") }}
        </p>
      </div>
    </section>

    <section class="section bg-cream">
      <div class="site-container">
        <!-- Category filter -->
        <div
          v-if="categories.length"
          class="mb-10 flex flex-wrap justify-center gap-2.5 3xl:mb-14"
        >
          <span
            class="rounded-pill bg-dark px-5 py-2.5 font-primary text-sm font-semibold text-white"
            >{{ $t("blog.allPosts") }}</span
          >
          <AppLink
            v-for="c in categories"
            :key="c.slug"
            :to="`/blogs/${c.slug}`"
            class="rounded-pill border border-dark/10 bg-white px-5 py-2.5 font-primary text-sm font-semibold text-dark transition-colors hover:border-accent hover:text-accent"
            >{{ c.name }}</AppLink
          >
        </div>

        <template v-if="posts.length">
          <!-- Featured -->
          <BlogCard
            v-if="featured"
            :post="featured"
            featured
            class="mb-10 3xl:mb-14"
          />

          <!-- Grid -->
          <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <BlogCard v-for="p in rest" :key="p.slug" :post="p" />
          </div>
        </template>

        <p v-else class="py-16 text-center font-primary text-muted">
          {{ $t("blog.empty") }}
        </p>
      </div>
    </section>

    <PageBottom />
  </div>
</template>
