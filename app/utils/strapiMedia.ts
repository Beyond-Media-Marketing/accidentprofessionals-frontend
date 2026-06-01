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
  media: { url?: string } | { data?: { url?: string } } | null | undefined,
  fallback?: string,
): string | undefined {
  // Tolerate both Strapi v5 flat shape ({ url }) and any nested { data: { url } }.
  const url =
    (media as any)?.url ?? (media as any)?.data?.url ?? (media as any)?.data?.attributes?.url

  if (!url) return fallback
  if (/^https?:\/\//i.test(url)) return url

  const { strapiUrl } = useRuntimeConfig().public
  return `${strapiUrl}${url}`
}
