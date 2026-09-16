/**
 * Hard guarantee that /forms/* is never indexed.
 *
 * robots.txt asks crawlers not to *fetch* these URLs; this header tells anything
 * that fetches one anyway (a shared link, a referrer-followed hit) not to index,
 * archive or snippet it. Belt and braces, because these pages carry rep
 * attribution links that get pasted into social bios and DMs.
 */
export default defineEventHandler((event) => {
  const path = event.path || ''
  if (path === '/forms' || path.startsWith('/forms/')) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  }
})
