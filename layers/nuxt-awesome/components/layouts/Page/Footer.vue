<script lang="ts" setup>
const { awesome } = useAppConfig()
const isMaxSm = ref(false)

const checkMaxSmBreakpoint = () => {
  const mediaQuery = window.matchMedia('(max-width: 639px)')
  isMaxSm.value = mediaQuery.matches
}

onMounted(() => {
  checkMaxSmBreakpoint()
  window.addEventListener('resize', checkMaxSmBreakpoint)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMaxSmBreakpoint)
})
</script>

<template>
  <footer class="flex border-t border-gray-900/10 dark:border-gray-50/[0.2]">
    <div
      class="flex-1 justify-between max-w-screen-2xl mx-auto px-4 flex flex-col md:flex-row py-2 space-y-2 md:space-y-0 items-center text-xs text-center md:text-left text-gray-400 
      max-sm:h-min max-sm:py-1 max-sm:space-y-0"
    >
      <div>
        Copyright ©
        {{ awesome?.layout?.footer?.year || new Date().getFullYear() }}
        {{ awesome?.author?.name || '' }}. All rights reserved.
      </div>
      <div v-if="!isMaxSm">{{ awesome.name }}</div>
    </div>
  </footer>
</template>
