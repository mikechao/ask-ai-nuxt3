import { GoogleAuthProvider, signInAnonymously, signInWithPopup, type Auth } from "firebase/auth"

export const useUserStore = defineStore('userStore', () => {
  const auth = useFirebaseAuth() as Auth

  const token = useCookie('token')

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

  return { loginAsGuest, loginWithGoogle }
})