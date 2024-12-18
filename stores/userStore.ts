import { GoogleAuthProvider, signInAnonymously, signInWithPopup, onAuthStateChanged, type Auth } from "firebase/auth"

export const useUserStore = defineStore('userStore', () => {
  const auth = useFirebaseAuth() as Auth
  const token = useCookie('token')
  const router = useRouter()
  const { awesome } = useAppConfig()

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

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider()
    signInWithPopup(auth, googleProvider)
    .catch((error) => {
      console.log('Fail to login')
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('errorCode', errorCode)
      console.log('errorMessage', errorMessage)
    })
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

  onAuthStateChanged(auth, (user) => {
    if (user) {
      token.value = user.uid
      changeToLogOut()
      router.push('/')
    } else {
      // user is signed out
      token.value = null
      console.log('No user in onAuthStateChanged')
    }
  })

  return { loginAsGuest, loginWithGoogle }
})