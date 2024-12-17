<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';
const googleProvider = new GoogleAuthProvider()

const { awesome } = useAppConfig()
const firebaseAuth = useFirebaseAuth() as Auth

const router = useRouter()

function login() {
    const menus = awesome.layout?.page?.navbar?.menus
    if (menus !== undefined) {
        const index = menus.findIndex(m => m.title === 'Login')
        menus[index].title = 'Log Out'
        menus[index].to = '/logout'
    }
}

function loginWithGoogle() {
    signInWithPopup(firebaseAuth, googleProvider)
    .then((result) => {
        console.log('login success')
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log('token', token)
        // The signed-in user info.
        const user = result.user;
        console.log('user', user)
        router.push('/')
    }).catch((error) => {
        console.log('Failed to login')
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
        <AwesomeButton text="Login" @click="login"/>
        <AwesomeButton @click="loginWithGoogle">
            <Icon name="simple-line-icons:social-google" class="w-5 h-5 mr-1"/>
            Login with Google
        </AwesomeButton>
    </div>
</template>