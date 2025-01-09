import type { Auth, AuthError, AuthProvider } from 'firebase/auth'

export const useFirebaseLogin = () => {
  const accountExists = ref<AccountExists>()

  async function loginAsGuest() {
    const nuxtApp = useNuxtApp()
    if (!nuxtApp.$auth) {
      await initAuth()
    }
    const auth = nuxtApp.$auth as Auth
    const { signInAnonymously } = await import('firebase/auth')
    return signInAnonymously(auth)
      .then((result) => {
        const user = result.user
        useState('user', () => user)
        return user
      })
      .catch((error) => {
        console.log('Failed to login')
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
      })

  }

  async function loginWithGoogle() {
    const { GoogleAuthProvider } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    return loginWithProvider(provider)
  }

  async function loginWithGitHub() {
    const { GithubAuthProvider } = await import('firebase/auth')
    const provider = new GithubAuthProvider()
    return loginWithProvider(provider)
  }

  async function loginWithProvider(provider: AuthProvider) {
    const nuxtApp = useNuxtApp()
    if (!nuxtApp.$auth) {
      await initAuth()
    }
    const auth = nuxtApp.$auth as Auth
    const { signInWithPopup } = await import('firebase/auth')
    return signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        useState('user', () => user)
        return user
      })
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/account-exists-with-different-credential') {
          // notify the user somehow
          const conflictEmail = getEmailFromError(error)
          const loginProvider = getProvider(provider)
          accountExists.value = {
            conflictEmail: conflictEmail,
            providerUsed: loginProvider
          }
        }
        console.log('Fail to login\nError code:\nError message:\n', errorCode, error.message)

      })
  }

  function getEmailFromError(error: AuthError) {
    return (error.customData.email) ? error.customData.email as string : 'No Email'
  }

  function getProvider(provider: AuthProvider) {
    if ("google.com" === provider.providerId) {
      return "Google"
    } else if ("github.com"=== provider.providerId) {
      return "GitHub"
    }
    return "Unknown"
  }

  async function initAuth() {
    const { initializeApp } = await import('firebase/app')

    const config = useRuntimeConfig()
    const firebaseConfig = {
      apiKey: config.public.FIREBASE_API_KEY,
      authDomain: config.public.FIREBASE_AUTH_DOMAIN,
      projectId: config.public.FIREBASE_PROJECT_ID,
      storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
      appId: config.public.FIREBASE_APP_ID,
      measurementId: config.public.FIREBASE_MEASUREMENT_ID
    }
  
    const app = initializeApp(firebaseConfig)
    const {initializeAuth, browserLocalPersistence, browserPopupRedirectResolver} = await import('firebase/auth')
    const auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver
    })
    const nuxtApp = useNuxtApp()
    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)
  }

  return {
    accountExists,
    loginAsGuest,
    loginWithGoogle,
    loginWithGitHub
  }
}