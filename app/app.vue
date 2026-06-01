<script setup lang="ts">
// Fetch sitewide globals (settings/nav/footer) once, then emit the sitewide
// organization JSON-LD. Both are no-ops/empty if the CMS is unreachable.
await fetchGlobals()
useOrganizationJsonLd()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
