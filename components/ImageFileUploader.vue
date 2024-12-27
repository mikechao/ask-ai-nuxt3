<script setup lang="ts">
import { useObjectUrl, useFileDialog } from "@vueuse/core"
import { useImageChatStore } from "~/stores/imageChat"
import { Jimp, JimpMime, ResizeStrategy } from "jimp"

const imageChatStore = useImageChatStore()
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false
})
const { clearFile } = storeToRefs(imageChatStore)

watch(clearFile, () => {
  resetFile()
})

async function resizeImage(imageURL: string) {
  const image = await Jimp.read(imageURL)
  const isHorizontal = image.width > image.height
  const ratio = isHorizontal ? image.width / image.height
          : image.height / image.width
  const width = 300
  const height = isHorizontal ? width / ratio : width * ratio
  const resized = image.resize({ w: width, h: height, mode: ResizeStrategy.BICUBIC})
  const outputBuffer = await resized.getBuffer(JimpMime.jpeg)
  const outputBlob = new Blob([outputBuffer], { type: JimpMime.jpeg})
  return new File([outputBlob], 'resized.jpeg')
}

onChange( async (file) => {
  if (file && file.item(0)) {
    const imageFile = file.item(0) as File
    const objectURL = useObjectUrl(imageFile)
    const resizedFile = await resizeImage(objectURL.value as string)
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