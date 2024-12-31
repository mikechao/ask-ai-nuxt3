<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import useVueAdvancedChat from '~/composables/useVueAdvancedChat'
import { useImageChatStore } from '~/stores/imageChat'
import { lightChatTheme } from './lightChatTheme'
import { darkChatTheme } from './darkChatTheme'
register()

const props = defineProps({
  height: {
    type: String,
    default: '100%',
  }
})

const colorMode = useColorMode()
const vueAdvancedChat = useVueAdvancedChat()
const imageChatStore = useImageChatStore()
const messagesLoaded = ref(false)

const { rooms, messages, messageActions, userId } = vueAdvancedChat

watch(messages, (newValue) => {
  imageChatStore.messages = [...newValue]
})

const styles = computed(() => {
  return colorMode.value === 'light' ? lightChatTheme : darkChatTheme
})

onUnmounted(() => {
  messagesLoaded.value = false
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  if (imageChatStore.messages.length > 0) {
    messages.value = [...imageChatStore.messages]
  } else {
    vueAdvancedChat.addAIMessage('Hello click the Choose File button to select an image file and ask your question below.')
  }
  messagesLoaded.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
  vueAdvancedChat.addUserMessage(content)
  if (imageChatStore.imageURL.length === 0) {
    vueAdvancedChat.addAIMessage('You did not give me an image to analyze')
  } else {
    imageChatStore.question = content
    await imageChatStore.sendPrompt()
    vueAdvancedChat.addAIMessage(imageChatStore.gptResponse)
  }
}
</script>
<template>
  <vue-advanced-chat
    :height="props.height"
    .styles="styles"
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
    :show-new-messages-divider="false"
    .rooms="rooms"
    .messages="messages"
    :current-user-id="userId"
    @fetch-messages="fetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
  />
</template>