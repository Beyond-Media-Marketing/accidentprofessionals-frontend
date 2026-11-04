/**
 * Never let a Vercel preview or the staging site (staging.accidentprofessionals.com) be indexed.
 *
 * Every deployment gets a *.vercel.app hostname that serves the full site. Without
 * this, those URLs are crawlable duplicates of production — and if SITE_URL is ever
 * misconfigured, canonical tags can point at them (which happened once: the live
 * homepage canonical pointed at accidentprofessionals-frontend-stag.vercel.app).
 *
 * Deliberately keyed off the *.vercel.app hostname rather than SITE_URL, so a wrong
 * SITE_URL can never accidentally noindex the real domain.
 */
export default defineEventHandler((event) => {
  // Strip the port so staging.accidentprofessionals.com:443 still matches.
  const host = (getRequestHost(event, { xForwardedHost: true }) || '').split(':')[0]
  if (host.endsWith('.vercel.app') || host === 'staging.accidentprofessionals.com') {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
