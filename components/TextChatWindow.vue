<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import useVueAdvancedChat from '~/composables/useVueAdvancedChat';
import { useTextChatStore } from '~/stores/textChat'
register()

const props = defineProps({
  height: {
    type: String,
    default: '100%',
  }
})

const colorMode = useColorMode()
const vueAdvancedChat = useVueAdvancedChat()
const textChatStore = useTextChatStore()
const messagesLoaded = ref(false)

const { rooms, messages, messageActions, userId } = vueAdvancedChat

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  vueAdvancedChat.addAIMessage("Hello add some text to the left and ask questions below and I will answer to the best of my ability")
  messagesLoaded.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
  vueAdvancedChat.addUserMessage(content)
  if (textChatStore.text.length === 0) {
    vueAdvancedChat.addAIMessage("You did not give me any text to analyze")
  } else {
    textChatStore.question = content
    textChatStore.createPrompt()
    await textChatStore.sendPrompt()
    vueAdvancedChat.addAIMessage(textChatStore.gptResponse)
  }
}
</script>

<template>
  <vue-advanced-chat
    :height="props.height"
    :theme="colorMode.value"
    :message-actions="messageActions"
    :show-reaction-emojis="false"
    :messages-loaded="messagesLoaded"
    :rooms-loaded="true"
    :single-room="true"
    :show-search="false"
    :show-add-room="true"
    :show-files="false"
    :show-audio="false"
    :show-emojis="false"
    .rooms="rooms"
    .messages="messages"
    :current-user-id="userId"
    @fetch-messages="fetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
  />
</template>