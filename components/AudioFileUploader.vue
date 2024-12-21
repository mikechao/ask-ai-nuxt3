<script setup lang="ts">
import { useFileDialog } from "@vueuse/core"
import { useAudioChatStore } from "~/stores/audioChat";

const audioChatStore = useAudioChatStore()
const { files, open, reset, onChange } = useFileDialog()
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
    <div class="flex">
      <button type="button" name="file" class="button button-primary w-36 mr-2" @click="open()">
        Choose file
      </button>
      <button
        type="button"
        :disabled="!files"
        class="button button-secondary w-36"
        @click="resetFile()"
      >
        Reset
      </button>
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