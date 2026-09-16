<script setup lang="ts">
/**
 * Rep-attributed call-back landing page: /forms/callback/<rep-slug>
 *
 * The rep lives in the PATH so the whole utm_* namespace stays free for paid
 * campaigns — rep attribution and channel attribution can't overwrite each other.
 *
 * Any well-formed slug is accepted rather than validating against a fixed roster,
 * so a new rep/affiliate/store can be handed a working link with no deploy.
 */
definePageMeta({ layout: 'form' })

const route = useRoute()
const rep = computed(() => String(route.params.rep || '').toLowerCase())

// Reject junk (spaces, punctuation, absurd length) so garbage can't reach ClickUp as a tag.
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rep.value) || rep.value.length > 64) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

// Private page: never indexed, never surfaced to AI crawlers.
useSeoMeta({
  title: 'Request a Call Back — Accident Professionals',
  robots: 'noindex, nofollow, noarchive, nosnippet',
})
</script>

<template>
  <CallbackForm :rep="rep" />
</template>
