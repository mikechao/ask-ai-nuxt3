<script setup lang="ts">
import { VueSidePanel } from 'vue3-side-panel'
import 'vue3-side-panel/dist/vue3-side-panel.css'
import { useSettingStore } from '~/stores/settingsStore'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const isOpen = ref(false)
const settingsStore = useSettingStore()
const sidePanelClass = 'bg-[#f8f9fa] dark:bg-gray-800'
const isVertical = ref(true)

// button styles
const verticalStyle = 'absolute left-0 top-1/2 transform -translate-y-1/2 ml-2'
const horizontalStyle = 'absolute top-0 left-1/2 transform -translate-x-1/2 mt-8'
const buttonStyle = ref(verticalStyle)

// the arrow icons to use
const arrowRight = 'mdi:arrow-expand-right'
const arrowDown = 'mdi:arrow-expand-down'
const arrowIcon = ref(arrowRight)

// styles for first arrow
const firstArrowVerticalStyle = 'mb-2'
const firstArrowHorizontalStyle = 'mr-2'
const firstArrowStyle = ref(firstArrowVerticalStyle)

// styles for second arrow
const secondArrowVerticalStyle = 'mt-2'
const secondArrowHorizontalStyle = 'ml-2'
const secondArrowStyle = ref(secondArrowVerticalStyle)

// button sizes
const buttonVerticalSize = 'md'
const buttonHorizontalSize = 'xs'
const buttonSize = ref(buttonVerticalSize)

// a key for the button to trigger redraw
const buttonKey = ref(newKeyValue())

const breakpoints = useBreakpoints(breakpointsTailwind)
let isSmaller: Ref<boolean> = breakpoints.smallerOrEqual("sm")

onMounted(() => {
  isSmaller = breakpoints.smallerOrEqual('sm')
})

watch(isSmaller, (value) => {
  if (value) {
    isVertical.value = false
    buttonStyle.value = horizontalStyle
    arrowIcon.value = arrowDown
    firstArrowStyle.value = firstArrowHorizontalStyle
    secondArrowStyle.value = secondArrowHorizontalStyle
    buttonSize.value = buttonHorizontalSize
    buttonKey.value = newKeyValue()
  } else {
    isVertical.value = true
    buttonStyle.value = verticalStyle
    arrowIcon.value = arrowRight
    firstArrowStyle.value = firstArrowVerticalStyle
    secondArrowStyle.value = secondArrowVerticalStyle
    buttonSize.value = buttonVerticalSize
    buttonKey.value = newKeyValue()
  }
}, {immediate: true})

function newKeyValue() {
  return Math.random() * 10000
}

async function aiModeHandler({checked, target}: {checked: boolean, target: HTMLInputElement}) {
  if (checked && !target.checked) {
    target.checked = true
  } 
}
</script>
<template>
  <AwesomeButton
    :key="buttonKey"
    :size="buttonSize"
    :vertical="isVertical" 
    :class="buttonStyle"
    @click="isOpen = true"
  >
    <Icon :name="arrowIcon" :class="firstArrowStyle"/>
    Settings
    <Icon :name="arrowIcon" :class="secondArrowStyle"/>
  </AwesomeButton>
  <VueSidePanel 
    v-model="isOpen"
    width="300px"
    side="left"
    :header-class="sidePanelClass"
    :body-class="sidePanelClass"
    hide-close-btn
  >
    <template #header>
      <AwesomeCard>
        <div class="flex justify-between items-center h-[52px]">
          <AwesomeCardTitle text="Settings"/>
          <AwesomeButton text="X" size="sm" @click="isOpen = false"/>
        </div>
      </AwesomeCard>
    </template>
    <template #default>
      <div class="h-full">
        <AwesomeCard>
          <AwesomeCardTitle text="Chat Mode"/>
            <AwesomeCardFooter>
              <p>Talk like AI Assistant</p>
              <AwesomeFormSwitch v-model="settingsStore.aiMode" @update:checked="aiModeHandler">
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
        <AwesomeCard>
          <AwesomeCardTitle text="AI Model"/>
            <AwesomeCardFooter>
              <p>Open AI GPT-4o mini</p>
              <AwesomeFormSwitch v-model="settingsStore.gpt4oMini">
                <span class="capitalize">
                  {{ settingsStore.gpt4oMini ? 'In use' : 'not in use' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
            <AwesomeCardFooter>
              <p>Google Gemini 1.5 Pro</p>
              <AwesomeFormSwitch v-model="settingsStore.geminiPro">
                <span class="capitalize">
                  {{  settingsStore.geminiPro ? 'In use' : 'not in use' }}
                </span>
              </AwesomeFormSwitch>
            </AwesomeCardFooter>
        </AwesomeCard>
      </div>    
    </template>
  </VueSidePanel>
</template>