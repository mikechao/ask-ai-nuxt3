<script setup lang="ts">
import { VueSidePanel } from 'vue3-side-panel'
import 'vue3-side-panel/dist/vue3-side-panel.css'

const isOpen = ref(false)
const pirateMode = ref(false)
const aiMode = ref(false)
const yodaMode = ref(false)

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
    width="300px"
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
        <AwesomeCard>
          <AwesomeCardTitle text="Chat Mode"/>
            <AwesomeCardFooter>
              <p>Talk like AI Assistant</p>
              <AwesomeFormSwitch v-model="aiMode">
                <span class="capitalize">
                  {{ aiMode ? 'enabled' : 'disabled' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
            <AwesomeCardFooter>
              <p>Talk like a pirate</p>
              <AwesomeFormSwitch v-model="pirateMode">
                <span class="capitalize">
                  {{ pirateMode ? 'enabled' : 'disabled' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
            <AwesomeCardFooter>
              <p>Talk like a Yoda</p>
              <AwesomeFormSwitch v-model="yodaMode">
                <span class="capitalize">
                  {{ yodaMode ? 'enabled' : 'disabled' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
        </AwesomeCard>
      </div>    
    </template>
  </VueSidePanel>
</template>