import { onAuthStateChanged, type User,} from "firebase/auth"

export const useUserStore = defineStore('userStore', () => {
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
    const authStore = await getAuthStore()
    await authStore.auth.signOut()
    isLoading.value = false
    token.value = null
    clearAccountExists()
    changeToLogin()
    router.push('/')
  }

  let authStore: ReturnType<typeof import('./useAuth').useAuth> | null = null
  async function getAuthStore() {
    if (authStore === null) {
      const authStoreModule = await import('./useAuth')
      authStore = authStoreModule.useAuth()
      onAuthStateChanged(authStore.auth, (user) => {
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
    }
    return authStore
  }

  async function loginAsGuest() {
    const authStore = await getAuthStore()
    isLoading.value = authStore.isLoading
    authStore.loginAsGuest()
    isLoading.value = authStore.isLoading
  }

  async function loginWithGoogle() {
    const authStore = await getAuthStore()
    isLoading.value = authStore.isLoading
    authStore.loginWithGoogle()
    isLoading.value = authStore.isLoading
  }

  async function loginWithGitHub() {
    const authStore = await getAuthStore()
    isLoading.value = authStore.isLoading
    authStore.loginWithGitHub()
    isLoading.value = authStore.isLoading
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