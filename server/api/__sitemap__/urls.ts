/**
 * Dynamic sitemap URLs sourced from Strapi.
 *
 * The @nuxtjs/sitemap module auto-discovers static pages; this endpoint adds the
 * content-driven routes (service categories + sub-services, city pages, attorney
 * profiles). Wired in via `sitemap.sources` in nuxt.config.
 */
export default defineSitemapEventHandler(async () => {
  const strapiUrl = process.env.STRAPI_URL ?? 'http://localhost:1337'

  const get = async (path: string): Promise<any[]> => {
    try {
      const res = await $fetch<any>(`${strapiUrl}${path}`)
      return res?.data ?? []
    } catch {
      return []
    }
  }

  const urls: { loc: string; priority?: number; changefreq?: string }[] = []

  // Service categories → /services/[category]
  const categories = await get('/api/service-categories?fields[0]=slug&pagination[pageSize]=100')
  for (const c of categories) {
    if (c?.slug) urls.push({ loc: `/services/${c.slug}`, priority: 0.8, changefreq: 'monthly' })
  }

  // Sub-services → /services/[category]/[service]
  const services = await get(
    '/api/services?fields[0]=slug&populate[category][fields][0]=slug&pagination[pageSize]=200',
  )
  for (const s of services) {
    const cat = s?.category?.slug
    if (cat && s?.slug) urls.push({ loc: `/services/${cat}/${s.slug}`, priority: 0.7, changefreq: 'monthly' })
  }

  // City pages → /georgia/[city]
  const cities = await get('/api/city-pages?fields[0]=slug&pagination[pageSize]=200')
  for (const c of cities) {
    if (c?.slug) urls.push({ loc: `/georgia/${c.slug}`, priority: 0.7, changefreq: 'monthly' })
  }

  // Attorney profiles → /legal-network/attorneys/[slug]
  const attorneys = await get('/api/attorneys?fields[0]=slug&pagination[pageSize]=200')
  for (const a of attorneys) {
    if (a?.slug) urls.push({ loc: `/legal-network/attorneys/${a.slug}`, priority: 0.6, changefreq: 'monthly' })
  }

  // Full category path (handles one level of nesting: parent/child).
  const catPath = (c: any) => (c?.parent?.slug ? `${c.parent.slug}/${c.slug}` : c?.slug)

  // Blog categories → /blogs/[...category]
  const blogCategories = await get(
    '/api/blog-categories?fields[0]=slug&populate[parent][fields][0]=slug&pagination[pageSize]=100',
  )
  for (const c of blogCategories) {
    if (c?.slug) urls.push({ loc: `/blogs/${catPath(c)}`, priority: 0.6, changefreq: 'weekly' })
  }

  // Blog posts → /blogs/[...category]/[slug]
  const posts = await get(
    '/api/blog-posts?fields[0]=slug&populate[category][fields][0]=slug&populate[category][populate][parent][fields][0]=slug&pagination[pageSize]=500',
  )
  for (const p of posts) {
    if (p?.category?.slug && p?.slug) urls.push({ loc: `/blogs/${catPath(p.category)}/${p.slug}`, priority: 0.6, changefreq: 'weekly' })
  }

  return urls
})
