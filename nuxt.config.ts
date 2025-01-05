// https://nuxt.com/docs/api/configuration/nuxt-config
const firebaseModules = ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/database", "firebase/storage"]
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/app.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    'nuxt-vuefire',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],
  runtimeConfig: {
    openaiAPIKey: '',
    deepgramAPIKey: '',
    googleAPIKey: '',
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["vue-advanced-chat"].includes(tag),
    },
  },
  colorMode: { 
    preference: 'light'
  },
  vuefire: {
    auth: {
      enabled: true,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
  vite: {
    esbuild: {
      drop: ['console', 'debugger']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/vue-advanced-chat')) return 'vueAdvancedChat'
            const seprateModule = firebaseModules.find(module => id.includes(module))
            if (seprateModule) return seprateModule
          }
        }
      }
    }
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