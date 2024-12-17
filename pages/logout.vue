<script setup lang="ts">
import type { Auth } from 'firebase/auth';
const router = useRouter()
const firebaseAuth = useFirebaseAuth() as Auth
const { awesome } = useAppConfig()
const token = useCookie('token')

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

onMounted(async () => {
    await firebaseAuth.signOut()
    token.value = null
    changeToLogin()
    router.push('/')
})
</script>

<template>
    <LayoutPageWrapper class="flex-1 flex">
        <LayoutPageSection class="flex-1 flex">
            <h1>Logging Out...</h1>
        </LayoutPageSection>
    </LayoutPageWrapper>
</template>