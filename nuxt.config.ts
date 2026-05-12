import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt'],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  googleFonts: {
    families: {
      'Fira Sans': [300, 400, 500, 600, 700],
      'DM Sans': [400, 500, 600, 700],
    },
    display: 'swap',
    preload: true,
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
    },
  },

  runtimeConfig: {
    public: {
      web3FormsKey: process.env.WEB3FORMS_KEY ?? '',
      phone: '(470)-407-2800',
      phoneHref: 'tel:+14704072800',
    },
  },
})
