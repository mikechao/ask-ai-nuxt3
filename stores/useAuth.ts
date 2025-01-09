import { GithubAuthProvider, GoogleAuthProvider, signInAnonymously, signInWithPopup, type Auth, type AuthError, type AuthProvider } from "firebase/auth"

export const useAuth = defineStore('authStore', () => {
  const nuxtApp = useNuxtApp()
  const auth = nuxtApp.$auth as Auth
  const accountExists = ref<AccountExists>()
  const isLoading = ref(false)

  function loginAsGuest() {
    isLoading.value = true
    signInAnonymously(auth)
    .catch((error) => {
      console.log('Fail to login')
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('errorCode', errorCode)
      console.log('errorMessage', errorMessage)
    })
    .finally(() => {
      isLoading.value = false
    })
  }

  async function loginWithProvider(provider: AuthProvider) {
    isLoading.value = true
    signInWithPopup(auth, provider)
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
      .finally(() => {
        isLoading.value = false
      })
  }

  function getEmailFromError(error: AuthError) {
    return (error.customData.email) ? error.customData.email as string : 'No Email'
  }

  function getProvider(provider: AuthProvider) {
    if (GoogleAuthProvider.PROVIDER_ID === provider.providerId) {
      return "Google"
    } else if (GithubAuthProvider.PROVIDER_ID === provider.providerId) {
      return "GitHub"
    }
    return "Unknown"
  }

  function loginWithGoogle() {
    loginWithProvider(new GoogleAuthProvider())
  }

  function loginWithGitHub() {
    const provider = new GithubAuthProvider()

    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
    //provider.addScope('repo')
    // no scope Grants read-only access to public information (including user profile info, repository info, and gists)
    loginWithProvider(provider)
  }

  return { 
    auth, 
    accountExists, 
    isLoading,
    loginAsGuest,
    loginWithGoogle,
    loginWithGitHub
   }
})