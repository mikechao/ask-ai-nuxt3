<script setup lang="ts">
import { useObjectUrl, useFileDialog } from "@vueuse/core"
import { useImageChatStore } from "~/stores/imageChat"

const imageChatStore = useImageChatStore()
const { open, reset, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false
})
const { clearFile } = storeToRefs(imageChatStore)

watch(clearFile, () => {
  resetFile()
})

async function resizeImage(imageURL: string, fileName: string) {
  const {jimp:j, jimpMime } = await getJimp()
  const image = await j.read(imageURL)
  const resized = image.scaleToFit({w: 200, h:200})
  const outputBuffer = await resized.getBuffer(jimpMime.jpeg)
  const outputBlob = new Blob([outputBuffer], { type: jimpMime.jpeg})
  return new File([outputBlob], fileName)
}

async function getJimp() {
  const jimp = await import('jimp')
  return {jimp: jimp.Jimp, jimpMime: jimp.JimpMime}
}

onChange( async (file) => {
  if (file && file.item(0)) {
    const imageFile = file.item(0) as File
    const objectURL = useObjectUrl(imageFile)
    const resizedFile = await resizeImage(objectURL.value as string, imageFile.name)
    imageChatStore.file = resizedFile
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
        :disabled="!imageChatStore.file"
        text="Reset"
        @click="resetFile()"
      />
    </div>
    <h3 v-if="imageChatStore.file?.name" class="font-semibold my-2 text-purple-300">{{ imageChatStore.file?.name }}</h3>
  </div>
</template>