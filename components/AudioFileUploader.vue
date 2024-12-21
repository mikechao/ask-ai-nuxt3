<script setup lang="ts">
import { useFileDialog } from "@vueuse/core"
import { useAudioChatStore } from "~/stores/audioChat";

const audioChatStore = useAudioChatStore()
const { files, open, reset, onChange } = useFileDialog({
  accept: "audio/*",
  multiple: false
})
const { clearFile } = storeToRefs(audioChatStore)

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