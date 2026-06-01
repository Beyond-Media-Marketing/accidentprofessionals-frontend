/**
 * Sitewide organization JSON-LD (LegalService / LocalBusiness), driven entirely
 * by the Strapi `global-setting` single-type. Call once in app.vue after
 * fetchGlobals() so it appears on every page.
 */
export function useOrganizationJsonLd() {
  const { siteUrl } = useRuntimeConfig().public
  const globals = useGlobals()

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => {
          const s = globals.value.settings
          if (!s) return ''

          const node: Record<string, any> = {
            '@context': 'https://schema.org',
            '@type': s.businessType || 'LegalService',
            name: s.siteName,
            description: s.businessDescription || s.tagline,
            url: s.websiteUrl || siteUrl,
            telephone: s.phone,
            email: s.email,
            image: strapiMedia(s.logo, `${siteUrl}/brand/logo.png`),
          }

          if (s.address) {
            node.address = { '@type': 'PostalAddress', streetAddress: s.address }
          }
          if (s.geoLatitude != null && s.geoLongitude != null) {
            node.geo = { '@type': 'GeoCoordinates', latitude: s.geoLatitude, longitude: s.geoLongitude }
          }
          if (Array.isArray(s.openingHoursSpec) && s.openingHoursSpec.length) {
            node.openingHoursSpecification = s.openingHoursSpec
          }
          const sameAs = (s.socials ?? []).map((x: any) => x.url).filter(Boolean)
          if (sameAs.length) node.sameAs = sameAs

          return JSON.stringify(node)
        }),
      },
    ],
  })
}
