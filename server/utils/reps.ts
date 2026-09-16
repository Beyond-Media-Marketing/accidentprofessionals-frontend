import type { H3Event } from 'h3'

/**
 * Form-holder roster, read from the Strapi `rep` collection.
 *
 * IMPORTANT: this is enrichment only. The ClickUp rep tag is always derived from
 * the URL slug and never depends on Strapi — so a CMS outage can never cost us
 * attribution. The roster only supplies the person's real name and tells us
 * whether a slug is recognised.
 *
 * When Strapi is unreachable we return `null` (meaning "can't know") rather than
 * an empty map, so the caller skips the `unknown-rep` flag instead of wrongly
 * marking every legitimate rep as unknown.
 */
export interface Rep {
  name: string
  slug: string
  active?: boolean
}

const TTL_MS = 5 * 60 * 1000
let cache: { at: number; bySlug: Map<string, Rep> } | null = null

export async function getReps(event: H3Event): Promise<Map<string, Rep> | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.bySlug

  const { strapiUrl } = useRuntimeConfig(event).public
  const res = await $fetch<{ data?: Rep[] }>(
    `${strapiUrl}/api/reps?fields[0]=name&fields[1]=slug&fields[2]=active&pagination[pageSize]=200`,
  ).catch(() => null)

  if (!Array.isArray(res?.data)) {
    // Serve a stale cache if we have one; otherwise admit we don't know.
    return cache?.bySlug ?? null
  }

  const bySlug = new Map<string, Rep>()
  for (const r of res.data) {
    if (r?.slug) bySlug.set(String(r.slug).toLowerCase(), r)
  }
  cache = { at: Date.now(), bySlug }
  return bySlug
}
