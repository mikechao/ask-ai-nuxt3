<script setup lang="ts">
const audioChatStore = useAudioChatStore()
</script>
<template>
  <div>
    <h3 class="mb-4">Transcribe the speech to text:</h3>
    <div  class="flex flex-col items-start space-x-4 md:justify-start">
      <AwesomeButton text="Transcribe" size="md" @click="audioChatStore.transcribeFile()"/>
    </div>
  </div>
  <div
    v-if="audioChatStore.transcript.length > 0"
    class="block w-full rounded-md border-0 bg-blue-900 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:p-4 sm:text-sm sm:leading-6 text-sm my-4"
  >
    {{ audioChatStore.transcript }}
  </div>
</template>