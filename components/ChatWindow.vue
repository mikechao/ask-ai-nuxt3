<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import useVueAdvancedChat from '~/composables/useVueAdvancedChat'
import { lightChatTheme } from './lightChatTheme'
import { darkChatTheme } from './darkChatTheme'
register()

const props = defineProps({
  height: {
    type: String,
    default: '100%',
  },
  store: {
    type: Object,
    required: true,
  },
  initialMessage: {
    type: String,
    required: true,
  },
  emptyMessage: {
    type: String,
    required: true,
  },
  getContent: {
    type: Function,
    required: true,
  },
  sendPrompt: {
    type: Function,
    required: true,
  }
})

function newKeyValue() {
  return Math.random() * 10000
}

const colorMode = useColorMode()
const vueAdvancedChat = useVueAdvancedChat()
const settingsStore = useSettingStore()
const messagesLoaded = ref(false)
const { rooms, messages, messageActions, userId, aiSenderId } = vueAdvancedChat
const key = ref(newKeyValue())

watch(messages, (newValue) => {
  props.store.setMessages(newValue)
})

watch(settingsStore.chatSettings, (newValue) => {
  if (newValue.aiAvatarURL) {
    rooms.value[0].avatar = newValue.aiAvatarURL
    // generate a new key to force a re-render 
    // to update the avatar for the room
    key.value = newKeyValue()
  }
})

const styles = computed(() => {
  return colorMode.value === 'light' ? lightChatTheme : darkChatTheme
})

onUnmounted(() => {
  messagesLoaded.value = false
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  if (props.store.messages.length > 0) {
    messages.value = [...props.store.messages]
  } else {
    vueAdvancedChat.addAIMessage(props.initialMessage)
  }
  messagesLoaded.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
  vueAdvancedChat.addUserMessage(content)
  if (props.getContent().length === 0) {
    vueAdvancedChat.addAIMessage(props.emptyMessage)
  } else {
    rooms.value[0].typingUsers = [aiSenderId]
    key.value = newKeyValue()
    props.store.setQuestion(content)
    await props.sendPrompt()
    vueAdvancedChat.addAIMessage(props.store.gptResponse)
    rooms.value[0].typingUsers = []
    key.value = newKeyValue()
  }
}

</script>
<template>
  <vue-advanced-chat
    :key="key"
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