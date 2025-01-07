<script setup lang="ts">
const SettingsPanel = defineAsyncComponent(() => import('~/components/SettingsPanel.vue'))
const route = useRoute()
const showSettings = computed(() => {
  const path = route.path
  if (path.endsWith('/text') || path.endsWith('/audio') || path.endsWith('/image')) {
    return true
  } else {
    return false
  }
})
</script>
<template>
    <div class="overflow-x-hidden">
      <LayoutPageNavbar class="h-[52px] max-h-[52px] max-sm:h-min max-sm:fixed"/>
        <SettingsPanel v-if=showSettings />
      <LayoutPageContent class="max-w-[68rem] m-auto h-full">
        <slot />
      </LayoutPageContent>
      <LayoutPageFooter class="h-[52px] md:h-[42px] max-sm:h-min" />
    </div>
</template>