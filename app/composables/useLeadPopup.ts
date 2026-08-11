/**
 * Config for the site-wide timed lead popup (`lead-popup` single-type).
 *
 * Fails soft: if the single-type is missing, empty, or the CMS is unreachable the
 * fetch resolves to null and the popup simply never renders — it must never be
 * able to break a page it's mounted on.
 */
export function useLeadPopup() {
  const { strapiUrl } = useRuntimeConfig().public
  return useAsyncData(
    'lead-popup',
    () => $fetch<any>(`${strapiUrl}/api/lead-popup`).then((r: any) => r?.data ?? null).catch(() => null),
    { default: () => null },
  )
}
