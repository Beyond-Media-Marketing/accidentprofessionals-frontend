export interface GlobalsState {
  settings: any | null
  navigation: any | null
  footer: any | null
}

const EMPTY: GlobalsState = { settings: null, navigation: null, footer: null }

/** Cached globals for every locale fetched so far, keyed by locale code. */
const useGlobalsCache = () => useState<Record<string, GlobalsState>>('globals', () => ({}))

/**
 * Sitewide globals (settings + navigation + footer) in the current language.
 * Read-only computed — follows the locale, so the header/footer switch language
 * together with the page.
 */
export const useGlobals = () => {
  const cache = useGlobalsCache()
  const { locale } = useNuxtApp().$i18n
  return computed<GlobalsState>(() => cache.value[locale.value] ?? EMPTY)
}

/**
 * Fetch the three global single-types for a locale and cache them in useState.
 * Safe to call in app.vue setup and again on every language switch; a locale
 * that's already cached is a no-op. Every request fails soft (null data) so the
 * site never crashes when the CMS is unreachable or a single-type is empty.
 */
export async function fetchGlobals(locale: string) {
  const cache = useGlobalsCache()
  const cached = cache.value[locale]
  if (cached?.settings && cached.navigation && cached.footer) {
    return cached
  }

  const settingsQuery = {
    populate: {
      logo: true,
      footerLogo: true,
      defaultOgImage: true,
      defaultSeo: { populate: '*' },
      socials: true,
    },
  }

  const navQuery = {
    populate: {
      items: { populate: { columns: { populate: { links: true } } } },
      cta: true,
    },
  }

  const footerQuery = {
    populate: {
      linkColumns: { populate: { links: true } },
      legalLinks: true,
    },
  }

  const [settings, navigation, footer] = await Promise.all([
    strapiGet('global-setting', settingsQuery, locale),
    strapiGet('navigation', navQuery, locale),
    strapiGet('footer', footerQuery, locale),
  ])

  const globals: GlobalsState = {
    settings: settings?.data ?? null,
    navigation: navigation?.data ?? null,
    footer: footer?.data ?? null,
  }
  cache.value = { ...cache.value, [locale]: globals }
  return globals
}
