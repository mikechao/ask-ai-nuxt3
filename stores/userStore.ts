import { GoogleAuthProvider, signInAnonymously, signInWithPopup, onAuthStateChanged,
  type Auth, type User, GithubAuthProvider, type AuthProvider,
  type AuthError, } from "firebase/auth"

export const useUserStore = defineStore('userStore', () => {
  const auth = useFirebaseAuth() as Auth
  const token = useCookie('token')
  const router = useRouter()
  const { awesome } = useAppConfig()
  const textChatStore = useTextChatStore()
  const audioChatStore = useAudioChatStore()
  const imageChatStore = useImageChatStore()
  const tokenStore = useTokenStore()
  const appUser = ref<User>()
  const isLoading = ref(false)
  const accountExists = ref<AccountExists>()

  async function deleteChat() {
    if (appUser.value) {
      if (appUser.value.isAnonymous) {
        $fetch('/api/chat?uid=' + token.value, { method: 'DELETE'})
      }
    }
  }

  async function clearAccountExists() {
    accountExists.value = undefined
  }

  async function logout() {
    deleteChat()
    textChatStore.clearChat()
    audioChatStore.clearChat()
    imageChatStore.clearChat()
    tokenStore.reset()
    await auth.signOut()
    isLoading.value = false
    token.value = null
    clearAccountExists()
    changeToLogin()
    router.push('/')
  }

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

  function loginWithProvider(provider: AuthProvider) {
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

  function changeToLogOut() {
    const menus = awesome.layout?.page?.navbar?.menus
    if (menus !== undefined) {
      const index = menus.findIndex(m => m.title === 'Login')
      if (index > -1) {
        menus[index].title = 'Log Out'
        menus[index].to = '/logout'
      }
    }
  }

  function changeToLogin() {
    const menus = awesome.layout?.page?.navbar?.menus
    if (menus !== undefined) {
      const index = menus.findIndex(m => m.title === 'Log Out')
      if (index > -1) {
        menus[index].title = 'Login'
        menus[index].to = '/login'
      }
    }
  }

  function getUserName() {
    return appUser.value?.displayName ?? 'Guest User'
  }

  function getUserPhotoURL() {
    return appUser.value?.photoURL ?? 'https://i.pravatar.cc/100'
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      appUser.value = user
      token.value = user.uid
      changeToLogOut()
      router.push('/')
    } else {
      // user is signed out
      appUser.value = undefined
    }
  })

  return { 
    loginAsGuest, 
    loginWithGoogle, 
    loginWithGitHub, 
    logout, 
    getUserName, 
    getUserPhotoURL, 
    deleteChat, 
    isLoading,
    accountExists,
    clearAccountExists
  }
})