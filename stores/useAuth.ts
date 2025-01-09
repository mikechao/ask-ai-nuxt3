import type { Auth } from "firebase/auth"

export const useAuth = defineStore('authStore', () => {
  const auth = useFirebaseAuth() as Auth

  return { auth }
})