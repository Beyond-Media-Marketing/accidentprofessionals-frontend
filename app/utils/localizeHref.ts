/**
 * Point an internal link at the right language: `/services/x` → `/es/services/x`
 * when the visitor is on the Spanish site. Slugs are shared across languages,
 * so the prefix is all that changes.
 *
 * Left untouched: English, external/tel:/mailto: links, in-page #anchors, links
 * that already carry a locale, and paths that aren't localized pages (API,
 * assets, the private /forms/* rep pages).
 */
export function localizeHref<T extends string | null | undefined>(href: T, locale: string): T {
  if (!href || locale === 'en') return href
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (/^\/(es|en)(?=$|[/?#])/.test(href)) return href
  if (/^\/(api|_nuxt|_ipx|forms)(?=$|[/?#])/.test(href)) return href
  // A file extension on the last segment means an asset (/locations.kml, PDFs…).
  if (/\.[a-z0-9]{2,5}(?=$|[?#])/i.test(href)) return href
  return (href === '/' ? `/${locale}` : /^\/[?#]/.test(href) ? `/${locale}${href.slice(1)}` : `/${locale}${href}`) as T
}

/** Rewrite every internal `href="/…"` inside a CMS HTML string (blog bodies, legal copy). */
export function localizeHtmlLinks(html: string, locale: string): string {
  if (!html || locale === 'en') return html
  return html.replace(/(<a\b[^>]*?\bhref=)(["'])(\/[^"']*)\2/gi, (_m, pre, q, href) => `${pre}${q}${localizeHref(href, locale)}${q}`)
}
