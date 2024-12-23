<script setup lang="ts">
const audioChatStore = useAudioChatStore()
const hasFile = computed(() => audioChatStore.file === undefined)
const disableTranscribe = computed(() => hasFile.value || audioChatStore.isTranscribing)
</script>
<template>
  <div>
    <h3 class="mb-4">Transcribe the speech to text:</h3>
    <div class="flex flex-col items-start space-x-4 md:justify-start">
      <AwesomeButton text="Transcribe" size="md" :disabled="disableTranscribe" @click="audioChatStore.transcribeFile()"/>
    </div>
  </div>
  <div v-if="audioChatStore.transcript.length > 0" class="mt-4">
    <textarea 
    v-if="audioChatStore.transcript.length > 0"
    v-model="audioChatStore.transcript"
    readonly
    style="overflow:auto;resize:none"
    />
  </div>
</template>