<script setup lang="ts">
import { useFileDialog, breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import { useAudioChatStore } from "~/stores/audioChat"

const audioChatStore = useAudioChatStore()
const { files, open, reset, onChange } = useFileDialog({
  accept: "audio/*",
  multiple: false
})
const { clearFile } = storeToRefs(audioChatStore)
const buttonSize = ref('md')
const fileButtonKey = ref(newKeyValue())
const resetButtonKey = ref(newKeyValue())
const breakpoints = useBreakpoints(breakpointsTailwind)
const isSmaller: Ref<boolean> = breakpoints.smallerOrEqual("sm")

onMounted(() => {
  isSmaller.value = breakpoints.smallerOrEqual('sm').value
})

watch(isSmaller, (value) => {
  if (value) {
    buttonSize.value = 'xs'
    fileButtonKey.value = newKeyValue()
    resetButtonKey.value = newKeyValue()
  } else {
    buttonSize.value = 'md'
    fileButtonKey.value = newKeyValue()
    resetButtonKey.value = newKeyValue()
  }
}, {immediate: true})

watch(clearFile, () => {
  resetFile()
})

onChange((file) => {
  if (file && file.item(0)) {
    audioChatStore.file = file.item(0) as File
    audioChatStore.clearFile = false
  }
})

function resetFile() {
  reset()
  audioChatStore.clearChat()
  audioChatStore.clearFile = false
}

function newKeyValue() {
  return Math.random() * 10000
}
</script>
<template>
  <div class="flex flex-col h-24 max-sm:h-16">
    <div class="flex space-x-4 justify-center md:justify-start max-sm:justify-start">
      <AwesomeButton
        :key="fileButtonKey"
        name="file" 
        :size="buttonSize" 
        text="Choose File" 
        @click="open()"
      />
      <AwesomeButton
        :key="resetButtonKey"
        :size="buttonSize" 
        :disabled="!files"
        text="Reset"
        @click="resetFile()"
      />
    </div>
    <div v-if="files" class="mt-2 max-sm:mt-1" >
      <li
        v-for="file of files"
        :key="file.name"
        class="list-none font-semibold my-2 text-purple-300 max-sm:text-sm"
      >
        {{ file.name }}
      </li>
    </div>
  </div>
</template>