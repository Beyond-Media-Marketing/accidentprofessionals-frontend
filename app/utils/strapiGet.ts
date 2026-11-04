import qs from 'qs'

const hasData = (res: any) => res?.data != null && !(Array.isArray(res.data) && res.data.length === 0)

// The Strapi base URL, remembered from the first call. `useRuntimeConfig()` only
// works while the Nuxt instance is in context — on the server that context is
// lost after the first `await` inside a useAsyncData handler, so handlers that
// chain several requests (the blog page) would otherwise throw on SSR.
let strapiBase: string | undefined
function strapiUrl(): string {
  try {
    strapiBase = useRuntimeConfig().public.strapiUrl
  } catch {
    if (!strapiBase) throw new Error('strapiGet: first call must run inside a Nuxt context')
  }
  return strapiBase!
}

/**
 * GET a Strapi REST endpoint in the visitor's language, falling back to English.
 *
 * Spanish entries are created from the translation memory (see the CMS repo's
 * data/i18n) — anything without a Spanish version yet (a new post, a page
 * created after the import) is served in English instead of a 404 / empty list.
 * Resolves to `null` when the CMS is unreachable, so pages fail soft.
 *
 *   const res = await strapiGet('home-page', { populate: {...} }, locale.value)
 */
export async function strapiGet<T = any>(
  path: string,
  query: Record<string, any> = {},
  locale = 'en',
): Promise<{ data: T; meta?: any } | null> {
  const base = strapiUrl()
  const get = (loc: string) =>
    $fetch<any>(`${base}/api/${path}?${qs.stringify({ ...query, locale: loc }, { encodeValuesOnly: true })}`)

  if (locale !== 'en') {
    const res = await get(locale).catch(() => null)
    if (hasData(res)) return res
  }
  return get('en').catch(() => null)
}
