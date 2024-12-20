import { GoogleAuthProvider, signInAnonymously, signInWithPopup, onAuthStateChanged, type Auth, type User, GithubAuthProvider, type AuthProvider } from "firebase/auth"

export const useUserStore = defineStore('userStore', () => {
  const auth = useFirebaseAuth() as Auth
  const token = useCookie('token')
  const router = useRouter()
  const { awesome } = useAppConfig()
  const textChatStore = useTextChatStore()

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
    await auth.signOut()
    token.value = null
    changeToLogin()
    router.push('/')
  }

  function loginAsGuest() {
    signInAnonymously(auth)
    .catch((error) => {
      console.log('Fail to login')
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('errorCode', errorCode)
      console.log('errorMessage', errorMessage)
    })
  }

  function loginWithProvider(provider: AuthProvider) {
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.log('Fail to login')
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
      })
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

  return { loginAsGuest, loginWithGoogle, loginWithGitHub, logout, getUserName, getUserPhotoURL, deleteChat }
})