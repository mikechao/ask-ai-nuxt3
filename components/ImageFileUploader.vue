<script setup lang="ts">
import { useObjectUrl, useFileDialog } from "@vueuse/core"
import { useImageChatStore } from "~/stores/imageChat"
import { Jimp } from "jimp"

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
    const imageFile = file.item(0) as File
    console.log('imageFIle', imageFile)
    const objectURL = useObjectUrl(imageFile)
    console.log('objectURL.value', objectURL.value)
    Jimp.read(objectURL.value as string)
      .then((image) => {
        console.log('in then image object', Object.prototype.toString.call(image))
      })
      .catch((error) => {
        console.error('error with jimp', error)
      })
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
  <div class="flex flex-col">
    <div class="flex space-x-4 justify-center md:justify-start">
      <AwesomeButton name="file" size="md" text="Choose File" @click="open()"/>
      <AwesomeButton
        size="md"
        :disabled="!files"
        text="Reset"
        @click="resetFile()"
      />
    </div>
    <div v-if="files" class="mt-3" >
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