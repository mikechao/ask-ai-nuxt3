export default defineNuxtRouteMiddleware(async (to, _from) => {
    // skip middleware on server
    if (import.meta.server) return
    
    const user = await getCurrentUser()
    if (to.path !== '/login') {
        if (!user) {
            return navigateTo({ path: '/login'})
        }
    }
})