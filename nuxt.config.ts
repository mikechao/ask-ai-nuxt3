// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false
  },
  routeRules: {
    '/nav': { prerender: true},
    '/image': {ssr: false},
    '/audio': {ssr: false},
    '/': {prerender: true},
    '/logout': {prerender: true},
    '/text': {ssr: false}
  },  
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/app.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],
  runtimeConfig: {
    openaiAPIKey: '',
    deepgramAPIKey: '',
    googleAPIKey: '',
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["vue-advanced-chat"].includes(tag),
    },
  },
  colorMode: { 
    preference: 'dark'
  },
  vite: {

  },
  googleFonts: {
    display: 'swap',
    families: {
      Nunito: {
        wght: [200, 300, 400, 600, 700, 800, 900],
        ital: [200, 300, 400, 600, 700, 800, 900],
      }
    }
  }
})