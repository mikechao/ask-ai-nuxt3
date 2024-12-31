<script setup lang="ts">
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.vue'))
const props = defineProps({
  height: {
    type: String,
    default: '100%',
  }
})
const imageChatStore = useImageChatStore()

function getContent() {
  return imageChatStore.imageURL
}

async function sendPrompt() {
  await imageChatStore.sendPrompt()
}
</script>
<template>
  <ChatWindow
    :height="props.height"
    :store="imageChatStore"
    initial-message="Hello add an image to the left and ask questions below and I will answer to the best of my ability"
    empty-message="You did not give me any image to analyze"
    :get-content="getContent"
    :send-prompt="sendPrompt"
  />
</template>