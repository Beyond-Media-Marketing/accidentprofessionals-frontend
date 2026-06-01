<script setup lang="ts">
// Layout for the NEW (Tailwind + Strapi-driven) pages. The legacy SCSS pages
// keep using layouts/default.vue with the old SCSS navbar/footer.
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
