<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

const audioChatStore = useAudioChatStore()
const hasFile = computed(() => audioChatStore.file === undefined)
const disableTranscribe = computed(() => hasFile.value || audioChatStore.isTranscribing)
const buttonSize = ref('md')
const buttonKey = ref(newKeyValue())
const breakpoints = useBreakpoints(breakpointsTailwind)
const isSmaller: Ref<boolean> = breakpoints.smallerOrEqual("sm")

onMounted(() => {
  isSmaller.value = breakpoints.smallerOrEqual('sm').value
})

watch(isSmaller, (value) => {
  if (value) {
    buttonSize.value = 'xs'
    buttonKey.value = newKeyValue()
  } else {
    buttonSize.value = 'md'
    buttonKey.value = newKeyValue()
  }
}, {immediate: true})

function newKeyValue() {
  return Math.random() * 10000
}
</script>
<template>
  <div class="flex flex-col h-full">
    <h3 class="mb-4 max-sm:mb-1">Transcribe the speech to text:</h3>
    <div class="flex flex-col items-start space-x-4 md:justify-start">
      <AwesomeButton
        :key="buttonKey"
        text="Transcribe" 
        :size="buttonSize" 
        :disabled="disableTranscribe" 
        @click="audioChatStore.transcribeFile()"
      />
    </div>
    <h3 v-if="audioChatStore.confidence > 0" class="mt-2">Transcription Confidence: {{ audioChatStore.confidence }}</h3>
    <div v-if="audioChatStore.transcript.length > 0" class="mt-4 flex-1 flex max-sm:mt-1">
      <textarea 
        v-model="audioChatStore.transcript"
        readonly
        class="w-full flex-1 resize-none overflow-y-auto"
      />
    </div>
  </div>
</template>