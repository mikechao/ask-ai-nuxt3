<script setup lang="ts">
const { awesome } = useAppConfig()

function login() {
    const menus = awesome.layout?.page?.navbar?.menus
    if (menus !== undefined) {
        const index = menus.findIndex(m => m.title === 'Login')
        menus[index].title = 'Log Out'
        menus[index].to = '/logout'
    }
}
</script>

<template>
    <div>
        <h1>This is the login page</h1>
        <AwesomeButton text="Login" @click="login"/>
    </div>
</template>