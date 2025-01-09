import type { Auth } from "firebase/auth"

export default defineNuxtRouteMiddleware(async (to, _from) => {
    const nuxtApp = useNuxtApp()
    const auth = nuxtApp.$auth as Auth
    if (to.path !== '/login') {
        if (!auth.currentUser) {
            return navigateTo({ path: '/login'})
        }
    }
})