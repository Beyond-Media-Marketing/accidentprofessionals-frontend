interface SeoComponent {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  canonicalUrl?: string | null
  ogImage?: { url?: string } | null
  noindex?: boolean | null
  nofollow?: boolean | null
  schemaType?: string | null
}

/**
 * Wire per-page SEO from a Strapi `shared.seo` component.
 *
 * Handles: <title>, meta description, keywords, canonical, Open Graph, Twitter
 * Card, robots (noindex/nofollow), theme-color, and a WebPage JSON-LD block.
 * Everything falls back to the global defaults from `global-setting`, so a page
 * with an empty SEO component still emits sensible tags.
 *
 * Pass a getter so it stays reactive after the page data resolves:
 *   usePageSeo(() => page.value?.seo)
 */
export function usePageSeo(
  seoGetter: () => SeoComponent | null | undefined,
  opts?: {
    /**
     * A page-specific image (usually the hero) to use when the CMS `seo.ogImage`
     * is empty. Pages used to set this with their own `useSeoMeta({ ogImage })`
     * *after* calling usePageSeo — but when the hero had no image that getter
     * returned `undefined` and wiped the tag entirely instead of falling through
     * to the global default. Routing it through here keeps the fallback chain intact.
     */
    ogImage?: () => string | undefined
  },
) {
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public
  const globals = useGlobals()

  const seo = computed(() => seoGetter() ?? {})
  const settings = computed(() => globals.value.settings ?? {})
  const defaultSeo = computed(() => settings.value?.defaultSeo ?? {})

  const title = computed(
    () => seo.value.metaTitle || defaultSeo.value.metaTitle || settings.value.siteName || 'Accident Professionals',
  )
  const description = computed(
    () => seo.value.metaDescription || defaultSeo.value.metaDescription || settings.value.tagline || '',
  )
  // The site serves URLs WITHOUT a trailing slash (server/middleware/redirects.ts
  // 301s any slashed form). CMS `canonicalUrl` values were carried over from the old
  // WordPress site, which used trailing slashes — left as-is they'd point the canonical
  // at a URL that redirects. Normalise here so one bad paste can't undo it site-wide.
  const stripTrailingSlash = (u: string) => (u.length > 1 ? u.replace(/\/+$/, '') : u)
  const canonical = computed(() =>
    stripTrailingSlash(seo.value.canonicalUrl || `${siteUrl}${route.path === '/' ? '' : route.path}`),
  )
  // Priority: page's own CMS ogImage → page hero → global defaultOgImage → bundled file.
  const ogImage = computed(() =>
    strapiMedia(
      seo.value.ogImage,
      opts?.ogImage?.() || strapiMedia(settings.value.defaultOgImage, `${siteUrl}/og-default.png`),
    ),
  )
  const robots = computed(() => {
    const parts = [seo.value.noindex ? 'noindex' : 'index', seo.value.nofollow ? 'nofollow' : 'follow']
    return parts.join(', ')
  })

  useSeoMeta({
    title,
    description,
    keywords: () => seo.value.keywords || defaultSeo.value.keywords || undefined,
    robots,
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage,
    ogSiteName: () => settings.value.siteName || 'Accident Professionals',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    twitterSite: () => settings.value.twitterHandle || undefined,
    themeColor: () => settings.value.themeColor || '#f3af00',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() =>
          JSON.stringify({
            '@context': 'https://schema.org',
            '@type': seo.value.schemaType || 'WebPage',
            name: title.value,
            description: description.value,
            url: canonical.value,
          }),
        ),
      },
    ],
  })
}
