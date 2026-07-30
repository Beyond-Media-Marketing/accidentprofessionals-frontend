/**
 * /llms.txt — a plain-text map of the site for AI assistants and LLM crawlers
 * (the emerging llmstxt.org convention, the AI-era counterpart to robots.txt).
 *
 * Generated from Strapi rather than hand-written, so it can't drift out of date
 * as services, cities, attorneys and posts are added or renamed.
 */
export default defineEventHandler(async (event) => {
  const strapiUrl = process.env.STRAPI_URL ?? 'http://localhost:1337'
  const site = (process.env.SITE_URL ?? 'https://accidentprofessionals.com').replace(/\/$/, '')

  const get = async (path: string): Promise<any[]> => {
    try {
      const res = await $fetch<any>(`${strapiUrl}${path}`)
      return res?.data ?? []
    } catch {
      return []
    }
  }

  const [categories, services, cities, attorneys, posts] = await Promise.all([
    get('/api/service-categories?fields[0]=slug&fields[1]=title&pagination[pageSize]=100'),
    get('/api/services?fields[0]=slug&fields[1]=title&populate[category][fields][0]=slug&pagination[pageSize]=200'),
    get('/api/city-pages?fields[0]=slug&fields[1]=title&pagination[pageSize]=200'),
    get('/api/attorneys?fields[0]=slug&fields[1]=name&fields[2]=firm&pagination[pageSize]=200'),
    get(
      '/api/blog-posts?fields[0]=slug&fields[1]=title&fields[2]=excerpt&populate[category][fields][0]=slug&populate[category][populate][parent][fields][0]=slug&sort=publishedDate:desc&pagination[pageSize]=100',
    ),
  ])

  const catPath = (c: any) => (c?.parent?.slug ? `${c.parent.slug}/${c.slug}` : c?.slug)
  const line = (title: string, path: string, note?: string) =>
    `- [${title}](${site}${path})${note ? `: ${note}` : ''}`

  const out: string[] = [
    '# Accident Professionals',
    '',
    '> Accident Professionals connects people injured in accidents across Georgia with',
    '> vetted personal injury attorneys. Free consultations, no upfront fees, available',
    '> 24/7, with English and Spanish support. We are a matching and support service —',
    '> not a law firm — and we stay involved throughout the case.',
    '',
    '## Main pages',
    line('Home', '/', 'Get connected with a vetted Georgia personal injury attorney'),
    line('About', '/about', 'Who we are and how the matching process works'),
    line('Services', '/services', 'All personal injury practice areas we cover'),
    line('Legal Network', '/legal-network', 'Our vetted attorney network, and how attorneys join'),
    line('Our Attorneys', '/legal-network/attorneys', 'Directory of attorneys in the network'),
    line('Areas We Serve', '/georgia', 'Georgia cities where we connect clients with attorneys'),
    line('Blog', '/blogs', 'Guides on accident claims, insurance and Georgia injury law'),
    line('Contact', '/contact-us', 'Free consultation request'),
    line('Privacy Policy', '/privacy-policy'),
  ]

  if (categories.length) {
    out.push('', '## Practice areas')
    for (const c of categories) {
      if (c?.slug) out.push(line(c.title || c.slug, `/services/${c.slug}`))
      for (const s of services.filter((x: any) => x?.category?.slug === c?.slug)) {
        if (s?.slug) out.push(line(`${s.title || s.slug}`, `/services/${c.slug}/${s.slug}`))
      }
    }
  }

  if (cities.length) {
    out.push('', '## Areas we serve')
    for (const c of cities) if (c?.slug) out.push(line(c.title || c.slug, `/georgia/${c.slug}`))
  }

  if (attorneys.length) {
    out.push('', '## Attorneys')
    for (const a of attorneys) {
      if (a?.slug) out.push(line(a.name || a.slug, `/legal-network/attorneys/${a.slug}`, a.firm || undefined))
    }
  }

  if (posts.length) {
    out.push('', '## Blog posts')
    for (const p of posts) {
      if (p?.slug && p?.category?.slug) {
        out.push(line(p.title || p.slug, `/blogs/${catPath(p.category)}/${p.slug}`, p.excerpt || undefined))
      }
    }
  }

  out.push('')

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=3600')
  return out.join('\n')
})
