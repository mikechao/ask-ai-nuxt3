<script lang="ts" setup>
// useUserStore to fix the issue of 1. Login 2. Close tab 3 reopen tab
// and the login button stays as login instead of logout
// useUserStore()
const { awesome } = useAppConfig()
useHead({
  title: awesome.name,
  htmlAttrs: {
    lang: 'en'
  }
})
useSeoMeta({
  title: awesome.name,
  ogTitle: awesome.name,
  description: awesome.description,
  ogDescription: awesome.description
})
</script>

<template>
  <Body
    class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950"
  >
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>