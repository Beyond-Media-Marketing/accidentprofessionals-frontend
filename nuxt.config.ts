/// <reference types="node" />
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt', '@nuxtjs/partytown'],

  partytown: {
    forward: ['dataLayer.push'],
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  googleFonts: {
    families: {
      'Fira Sans': [400, 500, 600, 700],
      'DM Sans': [400, 500, 600],
    },
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    download: true,
    inject: true,
  },


  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${resolve(__dirname, 'app/assets/scss/_mixins')}";`,
        },
      },
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      script: [
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TQBVGHZX');`,
          type: 'text/partytown',
          tagPriority: 'critical',
        },
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
    public: {
      web3FormsKey: process.env.WEB3FORMS_KEY ?? '',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? '',
      phone: '(470)-407-2800',
      phoneHref: 'tel:+14704072800',
    },
  },
})
