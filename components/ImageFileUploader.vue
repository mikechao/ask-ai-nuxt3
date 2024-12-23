<script setup lang="ts">
import { useFileDialog } from "@vueuse/core"
import { useImageChatStore } from "~/stores/imageChat"

const imageChatStore = useImageChatStore()
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false
})
const { clearFile } = storeToRefs(imageChatStore)

watch(clearFile, () => {
  resetFile()
})

onChange((file) => {
  if (file && file.item(0)) {
    imageChatStore.file = file.item(0) as File
    imageChatStore.clearFile = false
  }
})

function resetFile() {
  reset()
  imageChatStore.clearChat()
  imageChatStore.clearFile = false
}
</script>
<template>
  <div class="flex flex-col h-36">
    <div class="flex space-x-4 justify-center md:justify-start">
      <AwesomeButton name="file" size="md" text="Choose File" @click="open()"/>
      <AwesomeButton
        size="md"
        :disabled="!files"
        text="Reset"
        @click="resetFile()"
      />
    </div>
    <div v-if="files" class="mt-6" >
      <li
        v-for="file of files"
        :key="file.name"
        class="list-none font-semibold my-2 text-purple-300"
      >
        {{ file.name }}
      </li>
    </div>
  </div>
</template>