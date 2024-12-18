<script setup lang="ts">
const userStore = useUserStore()

onMounted(async () => {
    await userStore.logout()
})
</script>

<template>
    <LayoutPageWrapper class="flex-1 flex">
        <LayoutPageSection class="flex-1 flex">
            <h1>Logging Out...</h1>
        </LayoutPageSection>
    </LayoutPageWrapper>
</template>