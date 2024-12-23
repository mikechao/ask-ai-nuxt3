<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import useVueAdvancedChat from '~/composables/useVueAdvancedChat'
import { useAudioChatStore } from '~/stores/audioChat'
register()

const props = defineProps({
  height: {
    type: String,
    default: '100%',
  }
})

const colorMode = useColorMode()
const vueAdvancedChat = useVueAdvancedChat()
const audioChatStore = useAudioChatStore()
const messagesLoaded = ref(false)

const { rooms, messages, messageActions, userId } = vueAdvancedChat

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  vueAdvancedChat.addAIMessage('Hello click the Choose File button to select an audio file, then hit the Transcribe button and ask your question below.')
  messagesLoaded.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
  vueAdvancedChat.addUserMessage(content)
  if (audioChatStore.transcript.length === 0) {
    vueAdvancedChat.addAIMessage('You did not give me any audio to analyze')
  } else {
    audioChatStore.question = content
    audioChatStore.createPrompt()
    await audioChatStore.sendPrompt()
    vueAdvancedChat.addAIMessage(audioChatStore.gptResponse)
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