<script setup lang="ts">
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.vue'))

const props = defineProps({
  height: {
    type: String,
    default: '100%',
  }
})

const audioChatStore = useAudioChatStore()

function getContent() {
  return audioChatStore.transcript
}

async function sendPrompt() {
  audioChatStore.createPrompt()
  await audioChatStore.sendPrompt()
}
</script>
<template>
  <ChatWindow
    :height="props.height"
    :store="audioChatStore"
    initial-message="Hello click the Choose File button to select an audio file, then hit the Transcribe button and ask your question below."
    empty-message="You did not give me any audio to analyze"
    :get-content="getContent"
    :send-prompt="sendPrompt"
  />
</template>