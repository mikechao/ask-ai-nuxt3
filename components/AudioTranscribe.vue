<script setup lang="ts">
const audioChatStore = useAudioChatStore()
const hasFile = computed(() => audioChatStore.file === undefined)
const disableTranscribe = computed(() => hasFile.value || audioChatStore.isTranscribing)
</script>
<template>
  <div class="flex flex-col h-full">
    <h3 class="mb-4">Transcribe the speech to text:</h3>
    <div class="flex flex-col items-start space-x-4 md:justify-start">
      <AwesomeButton text="Transcribe" size="md" :disabled="disableTranscribe" @click="audioChatStore.transcribeFile()"/>
    </div>
    <h3 v-if="audioChatStore.confidence > 0" class="mt-2">Transcription Confidence: {{ audioChatStore.confidence }}</h3>
    <div v-if="audioChatStore.transcript.length > 0" class="mt-4 flex-1 flex">
      <textarea 
        v-model="audioChatStore.transcript"
        readonly
        class="w-full flex-1 resize-none overflow-y-auto"
      />
    </div>
  </div>
</template>