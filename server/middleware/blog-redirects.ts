/**
 * 301 the old WordPress blog category slug ('car-acccidents', triple-c typo) to
 * the cleaned slug ('car-accidents'). Covers both the category listing and every
 * post underneath it (incl. the nested winter-accidents child), preserving SEO.
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (url.pathname === '/blogs/car-acccidents' || url.pathname.startsWith('/blogs/car-acccidents/')) {
    const to = url.pathname.replace('/blogs/car-acccidents', '/blogs/car-accidents')
    return sendRedirect(event, to + url.search, 301)
  }
})
