// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/app.css'],
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  runtimeConfig: {
    openaiAPIKey: '',
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["vue-advanced-chat"].includes(tag),
    },
  },
  eslint: {

  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern'
        }
      }
    }
  }
})