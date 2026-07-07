import qs from 'qs'

/**
 * The shared attorney roster, read from the `attorney` collection.
 *
 * This is the single source of truth for "our attorneys" across the site
 * (service pages, legal network, etc.). Pages feed it into their team /
 * attorney-list sections. When a page (or service-defaults) has its own
 * `selectedAttorneys` relation set in the CMS, the caller uses that curated
 * list instead — otherwise it falls back to this full roster.
 *
 * Fetched once and cached under a stable key so every page/component shares it.
 */
export function useAttorneyRoster() {
  const { strapiUrl } = useRuntimeConfig().public
  const query = qs.stringify(
    { sort: ['order:asc'], populate: { photo: true }, pagination: { pageSize: 100 } },
    { encodeValuesOnly: true },
  )
  return useFetch<any>(`${strapiUrl}/api/attorneys?${query}`, {
    key: 'attorney-roster',
    transform: (r: any) => r?.data ?? [],
    default: () => [],
  })
}
