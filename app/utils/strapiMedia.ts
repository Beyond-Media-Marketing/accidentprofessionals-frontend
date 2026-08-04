/**
 * Resolve a Strapi media object to an absolute URL.
 * - Absolute URLs (https://, Cloud/CDN) are returned as-is.
 * - Relative URLs are prefixed with the Strapi base URL.
 * - When there is no media, the optional fallback (e.g. a /public asset) is returned.
 *
 * Use everywhere an image comes from Strapi so the UI never breaks on empty fields:
 *   <img :src="strapiMedia(page.heroImage, '/brand/logo.png')" />
 */
export function strapiMedia(
  media: { url?: string; updatedAt?: string } | { data?: { url?: string } } | null | undefined,
  fallback?: string,
): string | undefined {
  // Tolerate both Strapi v5 flat shape ({ url }) and any nested { data: { url } }.
  const url =
    (media as any)?.url ?? (media as any)?.data?.url ?? (media as any)?.data?.attributes?.url

  if (!url) return fallback

  const absolute = /^https?:\/\//i.test(url)
    ? url
    : `${useRuntimeConfig().public.strapiUrl}${url}`

  return withVersion(absolute, media)
}

/**
 * Append `?v=<updatedAt>` to a Strapi media URL.
 *
 * Strapi's "Replace media" overwrites the file *at the same URL*. The CDN in front
 * of `*.media.strapiapp.com` keys purely on URL, so it keeps serving the old bytes
 * long after the origin has the new ones — the classic "I updated the image in the
 * CMS and nothing changed" symptom. Strapi Cloud gives us no way to purge it.
 *
 * Keying the URL on the asset's `updatedAt` makes a replacement produce a new URL,
 * so the CDN fetches fresh; the URL stays stable while the asset is unchanged, so
 * caching still works normally.
 *
 * Requires `updatedAt` on the media object — queries that narrow media with
 * `fields: [...]` must include it alongside `url`.
 */
function withVersion(url: string, media: any): string {
  const updatedAt = media?.updatedAt ?? media?.data?.updatedAt ?? media?.data?.attributes?.updatedAt
  if (!updatedAt) return url

  const stamp = Date.parse(updatedAt)
  if (!Number.isFinite(stamp)) return url

  return `${url}${url.includes('?') ? '&' : '?'}v=${stamp}`
}
