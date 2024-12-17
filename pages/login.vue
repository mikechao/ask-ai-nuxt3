<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously , type Auth } from 'firebase/auth';
const googleProvider = new GoogleAuthProvider()

const { awesome } = useAppConfig()
const firebaseAuth = useFirebaseAuth() as Auth
const token = useCookie('token')
const router = useRouter()

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

onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
        token.value = user.uid
        changeToLogOut()
        router.push('/')
    } else {
        // user is signed out
        console.log('No user in onAuthStateChanged')
    }
})

function loginWithGoogle() {
    signInWithPopup(firebaseAuth, googleProvider)
    .catch((error) => {
        console.log('Failed to login')
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
    })
}

function loginAsGuest() {
    signInAnonymously(firebaseAuth)
    .catch((error) => {
        console.log('Fail to login')
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
    })
}
</script>

<template>
    <div>
        <h1>This is the login page</h1>
        <AwesomeButton @click="loginWithGoogle">
            <Icon name="simple-line-icons:social-google" class="w-5 h-5 mr-1"/>
            Login with Google
        </AwesomeButton>
        <AwesomeButton @click="loginAsGuest">
            <Icon name="fluent:guest-24-regular" class="w-5 h5"/>
            Login as Guest
        </AwesomeButton>
    </div>
</template>