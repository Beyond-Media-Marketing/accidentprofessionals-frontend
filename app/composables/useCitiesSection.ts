import qs from 'qs'

/**
 * The cities-we-serve block, fetched ONCE from the shared `cities-section`
 * single-type and cached per request.
 *
 * This is the single source of truth: the homepage, /services, service
 * sub-pages and the location pages all render the same data, so editors
 * maintain the city list in one place instead of five.
 *
 * Failures resolve to null (the section simply doesn't render) rather than
 * throwing — so the site keeps working before the single-type exists in a
 * given Strapi environment.
 */
export function useCitiesSection() {
  const { strapiUrl } = useRuntimeConfig().public

  const query = qs.stringify(
    { populate: { regions: { populate: { cities: true } }, cta: true } },
    { encodeValuesOnly: true },
  )

  return useAsyncData(
    'cities-section',
    () =>
      $fetch<any>(`${strapiUrl}/api/cities-section?${query}`)
        .then((r: any) => r?.data ?? null)
        .catch(() => null),
    { default: () => null },
  )
}
