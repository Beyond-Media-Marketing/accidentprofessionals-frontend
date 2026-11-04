<script setup lang="ts">
/**
 * Un-attributed version of the call-back form: /forms/callback
 * Same form, no rep tag — leads land in ClickUp marked "direct".
 */
definePageMeta({ layout: 'form' })
// Not localized — the call-back form has its own EN/ES toggle, so there is no /es/forms/* route.
defineI18nRoute(false)

useSeoMeta({
  title: 'Request a Call Back — Accident Professionals',
  robots: 'noindex, nofollow, noarchive, nosnippet',
})
</script>

<template>
  <CallbackForm :rep="null" />
</template>
