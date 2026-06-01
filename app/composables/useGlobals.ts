import qs from 'qs'

export interface GlobalsState {
  settings: any | null
  navigation: any | null
  footer: any | null
}

/** Sitewide globals (settings + navigation + footer), fetched once and cached. */
export const useGlobals = () =>
  useState<GlobalsState>('globals', () => ({
    settings: null,
    navigation: null,
    footer: null,
  }))

/**
 * Fetch the three global single-types once per app load and cache them in
 * useState. Safe to call in app.vue setup; subsequent calls are no-ops.
 * Every request fails soft (returns null data) so the site never crashes when
 * the CMS is unreachable or a single-type is empty.
 */
export async function fetchGlobals() {
  const { strapiUrl } = useRuntimeConfig().public
  const state = useGlobals()
  if (state.value.settings && state.value.navigation && state.value.footer) {
    return state.value
  }

  const settingsQuery = qs.stringify(
    {
      populate: {
        logo: true,
        footerLogo: true,
        defaultOgImage: true,
        defaultSeo: { populate: '*' },
        socials: true,
      },
    },
    { encodeValuesOnly: true },
  )

  const navQuery = qs.stringify(
    {
      populate: {
        items: { populate: { columns: { populate: { links: true } } } },
        cta: true,
      },
    },
    { encodeValuesOnly: true },
  )

  const footerQuery = qs.stringify(
    {
      populate: {
        linkColumns: { populate: { links: true } },
        legalLinks: true,
      },
    },
    { encodeValuesOnly: true },
  )

  const [settings, navigation, footer] = await Promise.all([
    $fetch<{ data: any }>(`${strapiUrl}/api/global-setting?${settingsQuery}`).catch(() => ({ data: null })),
    $fetch<{ data: any }>(`${strapiUrl}/api/navigation?${navQuery}`).catch(() => ({ data: null })),
    $fetch<{ data: any }>(`${strapiUrl}/api/footer?${footerQuery}`).catch(() => ({ data: null })),
  ])

  state.value.settings = settings.data
  state.value.navigation = navigation.data
  state.value.footer = footer.data
  return state.value
}
