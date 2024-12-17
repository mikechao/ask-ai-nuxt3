export default defineNuxtRouteMiddleware(async (to, _from) => {
    const user = await getCurrentUser()
    if (to.path !== '/login') {
        if (!user) {
            return navigateTo({ path: '/login'})
        }
    }
})