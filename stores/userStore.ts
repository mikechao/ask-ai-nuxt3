import type { Auth, User,} from "firebase/auth"

export const useUserStore = defineStore('userStore', () => {
  const token = useCookie('token')
  const router = useRouter()
  const { awesome } = useAppConfig()
  const textChatStore = useTextChatStore()
  const audioChatStore = useAudioChatStore()
  const imageChatStore = useImageChatStore()
  const tokenStore = useTokenStore()
  const appUser = ref<User>()

  async function deleteChat() {
    if (appUser.value) {
      if (appUser.value.isAnonymous) {
        $fetch('/api/chat?uid=' + token.value, { method: 'DELETE'})
      }
    }
  }

  async function logout() {
    deleteChat()
    textChatStore.clearChat()
    audioChatStore.clearChat()
    imageChatStore.clearChat()
    tokenStore.reset()
    const nuxtApp = useNuxtApp()
    const auth = nuxtApp.$auth as Auth
    await auth?.signOut()
    const user = useState('user')
    user.value = undefined
    appUser.value = undefined
    token.value = null
    changeToLogin()
    router.push('/')
  }

  async function setUser(user: User) {
    if (user) {
      appUser.value = user
      token.value = user.uid
      changeToLogOut()
      router.push('/')
    }
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
    logout, 
    getUserName, 
    getUserPhotoURL, 
    deleteChat, 
    setUser
  }
})