<script setup lang="ts">
import { VueSidePanel } from 'vue3-side-panel'
import 'vue3-side-panel/dist/vue3-side-panel.css'

const isOpen = ref(false)

const openPanel = () => {
  isOpen.value = true
}
const sidePanelClass = 'bg-[#f8f9fa] dark:bg-gray-800'
</script>
<template>
  <AwesomeButton 
    text="Settings" 
    :vertical=true 
    class="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2"
    @click="openPanel"
  />
  <VueSidePanel 
    v-model="isOpen"
    side="left"
    :header-class="sidePanelClass"
    :body-class="sidePanelClass"
    hide-close-btn
  >
    <template #header>
      <div class="flex justify-between items-center h-[52px]">
        <h1>Settings</h1>
        <AwesomeButton text="X" size="sm" @click="isOpen = false"/>
      </div>
    </template>
    <template #default>
      <div class="h-full">
        <h2> This is scrolled body! </h2>
      </div>    
    </template>
  </VueSidePanel>
</template>