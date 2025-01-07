<script setup lang="ts">
import { useObjectUrl, useFileDialog, breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import { useImageChatStore } from "~/stores/imageChat"

const imageChatStore = useImageChatStore()
const { open, reset, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false
})
const { clearFile } = storeToRefs(imageChatStore)
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

function newKeyValue() {
  return Math.random() * 10000
}
</script>
<template>
  <div class="flex flex-col">
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
        :disabled="!imageChatStore.file"
        text="Reset"
        @click="resetFile()"
      />
    </div>
    <h3 v-if="imageChatStore.file?.name" class="font-semibold my-2 text-purple-300">{{ imageChatStore.file?.name }}</h3>
  </div>
</template>