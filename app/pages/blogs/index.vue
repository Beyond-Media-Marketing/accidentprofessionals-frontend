<script setup lang="ts">
import qs from "qs";
import { computed } from "vue";

definePageMeta({ layout: "site" });

const { strapiUrl } = useRuntimeConfig().public;

const postsQuery = qs.stringify(
  {
    sort: ["publishedDate:desc", "createdAt:desc"],
    populate: {
      coverImage: true,
      category: {
        fields: ["name", "slug"],
        populate: { parent: { fields: ["name", "slug"] } },
      },
    },
    pagination: { pageSize: 100 },
  },
  { encodeValuesOnly: true }
);
const catsQuery = qs.stringify(
  {
    sort: ["order:asc", "name:asc"],
    fields: ["name", "slug"],
    filters: { parent: { id: { $null: true } } },
    pagination: { pageSize: 100 },
  },
  { encodeValuesOnly: true }
);

const { data } = await useAsyncData("blogs-index", async () => {
  const [postsRes, catsRes] = await Promise.all([
    $fetch<any>(`${strapiUrl}/api/blog-posts?${postsQuery}`).catch(() => null),
    $fetch<any>(`${strapiUrl}/api/blog-categories?${catsQuery}`).catch(
      () => null
    ),
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

useHead({ title: "Blog — Accident Professionals" });
useSeoMeta({
  description:
    "Insights, guides, and resources on car accidents, truck accidents, premises liability, and personal injury claims from Accident Professionals.",
});
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-dark text-on-dark">
      <div class="site-container py-16 text-center 3xl:py-20">
        <h1
          class="font-secondary text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.08]"
        >
          The Accident Professionals <span class="text-accent">Blog</span>
        </h1>
        <p
          class="mx-auto mt-5 max-w-[640px] font-primary text-[15px] leading-[1.7] text-white/70 3xl:text-base"
        >
          Straight-talking guides on what to do after an accident, how claims
          really work, and how to protect your rights in Georgia.
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
            >All Posts</span
          >
          <NuxtLink
            v-for="c in categories"
            :key="c.slug"
            :to="`/blogs/${c.slug}`"
            class="rounded-pill border border-dark/10 bg-white px-5 py-2.5 font-primary text-sm font-semibold text-dark transition-colors hover:border-accent hover:text-accent"
            >{{ c.name }}</NuxtLink
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
          No posts yet — check back soon.
        </p>
      </div>
    </section>

    <PageBottom />
  </div>
</template>
