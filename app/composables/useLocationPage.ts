import qs from 'qs'
import { computed } from 'vue'

/**
 * Fetches a state-page or city-page by slug + the shared service-defaults.
 * `state-page` (e.g. Georgia) and `city-page` (e.g. Atlanta) are separate Strapi
 * collections with different sections, so the populate differs per type.
 *
 * Both requests run inside a single useAsyncData handler via $fetch — this
 * avoids the "composable called outside setup" error you get when awaiting one
 * Nuxt composable (useFetch) before calling another.
 */
export async function useLocationPage(type: 'state' | 'city', slug: string) {
  const { strapiUrl } = useRuntimeConfig().public
  const endpoint = type === 'state' ? 'state-pages' : 'city-pages'

  const common = {
    hero: { populate: { bgImage: true, urgencyBullets: true, caseOptions: true } },
    practiceAreas: { populate: { cta: true, features: { populate: { icon: true } } } },
    testimonials: { populate: { items: true } },
    faq: { populate: { items: true } },
    seo: { populate: '*' },
  }

  const populate =
    type === 'state'
      ? {
          ...common,
          heroStats: true,
          cities: { populate: { regions: { populate: { cities: true } }, cta: true } },
          facts: { populate: { stats: true, image: true } },
        }
      : {
          ...common,
          whyTrust: { populate: { cta: true, image: true } },
          whyChoose: { populate: { items: true, image: true } },
          stepsToTake: { populate: { steps: true } },
          damages: { populate: { tabs: { populate: { items: true } }, cta: true } },
          georgiaLaw: { populate: { cards: true, images: true } },
          nearbyCities: { populate: { cities: true } },
        }

  const locationQuery = qs.stringify(
    { filters: { slug: { $eq: slug } }, populate },
    { encodeValuesOnly: true },
  )
  const defaultsQuery = qs.stringify(
    { populate: { heroDefaults: true, closingCta: { populate: { cta: true } } } },
    { encodeValuesOnly: true },
  )

  // Lightweight list of every city (title + slug) — used to auto-generate each
  // city's "Where to Find Us" nearby-cities list. Only needed on city pages.
  const citiesQuery = qs.stringify(
    { fields: ['title', 'slug'], sort: ['title:asc'], pagination: { pageSize: 200 } },
    { encodeValuesOnly: true },
  )

  const { data } = await useAsyncData(`${type}-page-${slug}`, async () => {
    const [locRes, defRes, citiesRes] = await Promise.all([
      $fetch<any>(`${strapiUrl}/api/${endpoint}?${locationQuery}`),
      $fetch<any>(`${strapiUrl}/api/service-defaults?${defaultsQuery}`),
      type === 'city' ? $fetch<any>(`${strapiUrl}/api/city-pages?${citiesQuery}`) : Promise.resolve(null),
    ])
    return {
      loc: locRes?.data?.[0] ?? null,
      def: defRes?.data ?? null,
      cities: citiesRes?.data ?? [],
    }
  })

  const loc = computed(() => data.value?.loc ?? null)
  const def = computed(() => data.value?.def ?? null)
  const cities = computed(() => data.value?.cities ?? [])
  return { loc, def, cities }
}
