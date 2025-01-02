<script setup lang="ts">
import { VueSidePanel } from 'vue3-side-panel'
import 'vue3-side-panel/dist/vue3-side-panel.css'
import { useSettingStore } from '~/stores/settingsStore'

const isOpen = ref(false)
const settingsStore = useSettingStore()
const sidePanelClass = 'bg-[#f8f9fa] dark:bg-gray-800'

async function aiModeHanlder({checked, target}: {checked: boolean, target: HTMLInputElement}) {
  if (checked && !target.checked) {
    target.checked = true
  } 
}
</script>
<template>
  <AwesomeButton 
    text="Settings" 
    :vertical=true 
    class="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2"
    @click="isOpen = true"
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
              <AwesomeFormSwitch v-model="settingsStore.aiMode" @update:checked="aiModeHanlder">
                <span class="capitalize">
                  {{ settingsStore.aiMode ? 'enabled' : 'disabled' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
            <AwesomeCardFooter>
              <p>Talk like a pirate</p>
              <AwesomeFormSwitch v-model="settingsStore.pirateMode">
                <span class="capitalize">
                  {{ settingsStore.pirateMode ? 'enabled' : 'disabled' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
            <AwesomeCardFooter>
              <p>Talk like Yoda</p>
              <AwesomeFormSwitch v-model="settingsStore.yodaMode">
                <span class="capitalize">
                  {{ settingsStore.yodaMode ? 'enabled' : 'disabled' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
        </AwesomeCard>
      </div>    
    </template>
  </VueSidePanel>
</template>