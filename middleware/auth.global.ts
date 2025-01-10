export default defineNuxtRouteMiddleware(async (to, _from) => {
    const user = useState('user')
    if (to.path !== '/') {
        if (!user || !user.value) {
            return navigateTo({ path: '/'})
        }
    }
})