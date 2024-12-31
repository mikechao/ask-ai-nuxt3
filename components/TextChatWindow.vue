<script setup lang="ts">
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.vue'))

const props = defineProps({
  height: {
    type: String,
    default: '100%',
  }
})

const textChatStore = useTextChatStore()

function getContent() {
  return textChatStore.text
}

async function sendPrompt() {
  textChatStore.createPrompt()
  await textChatStore.sendPrompt()
}
</script>
<template>
  <ChatWindow
    :height="props.height"
    :store="textChatStore"
    initial-message="Hello add some text to the left and ask questions below and I will answer to the best of my ability"
    empty-message="You did not give me any text to analyze"
    :get-content="getContent"
    :send-prompt="sendPrompt"
  />
</template>