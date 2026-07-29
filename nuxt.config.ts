export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxt/image'],

  // Optimized responsive images (WebP/AVIF + lazy). Local /public assets work
  // out of the box; allow the Strapi host so CMS-uploaded media is optimized too.
  image: {
    // Allow the Strapi API host AND the Strapi Cloud media subdomain
    // (<project>.media.strapiapp.com), where uploaded media is actually served.
    // NOTE: media stays on *.media.strapiapp.com even behind a custom API domain
    // (e.g. cms.accidentprofessionals.com), so set STRAPI_MEDIA_URL to keep it
    // allowlisted — otherwise @nuxt/image refuses every CMS image.
    domains: (() => {
      const hosts = new Set<string>()
      const add = (raw?: string) => {
        if (!raw) return
        try {
          hosts.add(new URL(raw).hostname)
        } catch {
          /* ignore malformed env value */
        }
      }
      add(process.env.STRAPI_URL ?? 'http://localhost:1337')
      add(process.env.STRAPI_MEDIA_URL)
      // Derive the media subdomain when the API is still on the default Cloud host.
      const apiHost = [...hosts][0]
      if (apiHost?.endsWith('.strapiapp.com')) {
        hosts.add(apiHost.replace(/\.strapiapp\.com$/, '.media.strapiapp.com'))
      }
      return hosts.size ? [...hosts] : ['localhost']
    })(),
    format: ['avif', 'webp'],
  },

  // Tailwind powers the NEW (Strapi-driven) pages. Preflight is disabled in
  // tailwind.config.ts so it coexists with the legacy SCSS pages.
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  site: {
    url: process.env.SITE_URL ?? 'http://localhost:3000',
  },

  // Keep the legacy home backup out of the sitemap (duplicate content).
  // Dynamic (Strapi-driven) routes are added via the server source below.
  sitemap: {
    exclude: ['/home-legacy'],
    sources: ['/api/__sitemap__/urls'],
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  googleFonts: {
    families: {
      'Fira Sans': [400, 500, 600, 700],
      'DM Sans': [400, 500, 600],
      'Inter': [400, 500, 600, 700],
    },
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    download: true,
    inject: true,
  },


  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      script: [
        // dataLayer initialized early so any pre-load pushes are queued
        { innerHTML: `window.dataLayer=window.dataLayer||[];` },
      ],
      noscript: [
        {
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQBVGHZX" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          tagPosition: 'bodyOpen',
        },
      ],
      link: [
        // Preconnect for GTM
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    // Server-only secret (kept for reference; Web3Forms verifies Turnstile itself).
    turnstileSecret: process.env.TURNSTILE_SECRET ?? '',
    public: {
      // Web3Forms access keys are PUBLIC by design — the free plan only accepts
      // submissions from the browser, so the keys must be client-readable.
      // Routed per form type: attorney applications vs. everything else.
      web3FormsKey: process.env.WEB3FORMS_KEY ?? '',
      web3FormsKeyLeads: process.env.WEB3FORMS_KEY_LEADS ?? '',
      web3FormsKeyAttorneys: process.env.WEB3FORMS_KEY_ATTORNEYS ?? '',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? '',
      strapiUrl: process.env.STRAPI_URL ?? 'http://localhost:1337',
      siteUrl: process.env.SITE_URL ?? 'http://localhost:3000',
      // NOTE: phone/phoneHref stay here only for the 3 legacy SCSS pages.
      // New pages read these from the Strapi global-setting single-type.
      phone: '(470) 407-2800',
      phoneHref: 'tel:4704072800',
    },
  },
})
