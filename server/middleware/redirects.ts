/**
 * WordPress → Nuxt migration redirects (single-hop 301s).
 *
 * Built from the old site's Rank Math sitemaps (149 URLs) and verified against
 * the live Strapi slugs, so every target below is a real route.
 *
 * Rules are applied in order and resolved to ONE final destination before
 * redirecting, so we never emit a redirect chain (Google/SEMrush penalise those):
 *   1. strip the /es/ language prefix (no Spanish site exists yet)
 *   2. fix the legacy blog category typo (car-acccidents → car-accidents)
 *   3. apply the explicit old→new map
 *   4. normalise the trailing slash (old site used them, new site doesn't)
 */

/** Attorneys that still exist — old root-level URL → /legal-network/attorneys/<slug>. */
const ATTORNEYS = [
  'benjamin-j-rollins',
  'brian-moore',
  'desmond-a-humphrey',
  'e-david-ballard-iii',
  'ivan-bracho-gonzalez',
  'john-winkenwerder',
  'kurtis-badger-esq',
]

/** Old service pages that lived at the site root. */
const ROOT_SERVICES: Record<string, string> = {
  '/car-accident': '/services/auto-accidents/car-accidents',
  '/truck-accident': '/services/auto-accidents/truck-accidents',
  '/motorcycle-accident': '/services/auto-accidents/motorcycle-accidents',
  '/rideshare-accident': '/services/auto-accidents/rideshare-accidents',
  '/slip-and-fall-injury': '/services/premises-liability/slip-and-fall',
  '/workers-compensation': '/services/workplace-accidents/workers-compensation',
}

/** Service pages that were nested under /georgia/ on the old site. */
const GEORGIA_SERVICES: Record<string, string> = {
  'car-accident': '/services/auto-accidents/car-accidents',
  'truck-accident': '/services/auto-accidents/truck-accidents',
  'motorcycle-accident': '/services/auto-accidents/motorcycle-accidents',
  'rideshare-accident': '/services/auto-accidents/rideshare-accidents',
  'slip-fall-accident': '/services/premises-liability/slip-and-fall',
  'workers-compensation': '/services/workplace-accidents/workers-compensation',
}

/** Old city slug → new city slug (only where they differ). */
const CITY_SLUGS: Record<string, string> = {
  acworth: 'acworth-personal-injury',
  'atlanta-personal-injury-lawyer': 'atlanta-personal-injury',
  'lilburn-personal-injury-lawyer': 'lilburn-personal-injury',
}

/** Old cities with no page on the new site — send to the Georgia index. */
const RETIRED_CITIES = new Set(['macon-personal-injury'])

/** One-off page moves + retired WordPress theme/demo pages. */
const EXACT: Record<string, string> = {
  ...ROOT_SERVICES,
  '/contact-us-2': '/contact-us',
  '/personal-injury-service-areas': '/georgia',
  // Retired pages — send to the homepage rather than 404.
  '/thank-you': '/',
  '/test': '/',
  '/error-404': '/',
  '/portfolio-v1': '/',
  '/portfolio-v2': '/',
  '/portfolio-v3': '/',
  '/portfolio-v4': '/',
  // Attorney who is no longer in the network.
  '/james-harmon-groves': '/legal-network/attorneys',
}
for (const slug of ATTORNEYS) EXACT[`/${slug}`] = `/legal-network/attorneys/${slug}`

/** Resolve an incoming path to its final destination (or null if it's already correct). */
function resolve(pathname: string): string | null {
  let p = pathname

  // 1. Drop the /es language prefix — no Spanish site yet, so serve the English page.
  if (p === '/es' || p === '/es/') p = '/'
  else if (p.startsWith('/es/')) p = p.slice(3)

  // 2. Legacy blog category typo (triple-c). Covers nested categories too.
  if (p.startsWith('/blogs/car-acccidents')) {
    p = p.replace('/blogs/car-acccidents', '/blogs/car-accidents')
  }

  // 3. Normalise the trailing slash before map lookups (old site used them).
  if (p.length > 1 && p.endsWith('/')) p = p.replace(/\/+$/, '') || '/'

  // 4. Explicit one-to-one moves.
  if (EXACT[p]) p = EXACT[p]

  // 5. /georgia/* — services that were nested there, plus renamed/retired cities.
  const geo = p.match(/^\/georgia\/([^/]+)$/)
  if (geo) {
    const slug = geo[1]!
    if (GEORGIA_SERVICES[slug]) p = GEORGIA_SERVICES[slug]!
    else if (RETIRED_CITIES.has(slug)) p = '/georgia'
    else if (CITY_SLUGS[slug]) p = `/georgia/${CITY_SLUGS[slug]}`
  }

  return p === pathname ? null : p
}

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const { pathname, search } = url

  // Skip framework internals, the API, and anything with a file extension
  // (/locations.kml, images, etc.) so assets are never touched.
  if (
    pathname.startsWith('/_nuxt') ||
    pathname.startsWith('/_ipx') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/__') ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return
  }

  const target = resolve(pathname)
  if (target) return sendRedirect(event, target + search, 301)
})
