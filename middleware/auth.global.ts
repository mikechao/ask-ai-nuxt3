import { useCurrentUser } from "vuefire"

export default defineNuxtRouteMiddleware(async (to, _from) => {
    // skip middleware on server
    if (import.meta.server) return
    const user = useCurrentUser()
    if (to.path !== '/login') {
        if (!user.value) {
            return navigateTo({ path: '/login'})
        }
    }
})