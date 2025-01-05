<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import type {Room, Message, RoomUser, UserStatus, } from 'vue-advanced-chat'
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

const colorMode = useColorMode()
const settingsStore = useSettingStore()
const messagesLoaded = ref(false)
const userStore = useUserStore()
const settingStore = useSettingStore()
const userId = '1234'
const userAvatar = userStore.getUserPhotoURL()
const status: UserStatus = { state: 'online', lastChanged: "Never"}
const aiSenderId = "1"
const users: RoomUser[] = [
  { _id: aiSenderId, username: "AI Bot", avatar: settingStore.chatSettings.aiAvatarURL, status: status },
  { _id: userId, username: userStore.getUserName(), avatar: userAvatar, status: status }
]
const rooms: Ref<Room[]> = ref([
  { roomId: '1', roomName: 'Ask AI', users: users, avatar: settingStore.chatSettings.aiAvatarURL, }
])
const messageActions: string[] = []
const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})
const messages: Ref<Message[]> = ref([])
const key = ref(newKeyValue())

let messageId = 1

function addAIMessage(content: string) {
  messageId++
  const aiMessage = { _id: messageId.toString(), senderId: aiSenderId, content: content, avatar: settingStore.chatSettings.aiAvatarURL, date: formattedDate}
  messages.value = [...messages.value, aiMessage]
}

function addUserMessage(content: string) {
  messageId++
  const userMessage = { _id: messageId.toString(), senderId: userId, content: content, avatar: userAvatar, date: formattedDate}
  messages.value = [...messages.value, userMessage]
}

function newKeyValue() {
  return Math.random() * 10000
}

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
    addAIMessage(props.initialMessage)
  }
  messagesLoaded.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
  addUserMessage(content)
  if (props.getContent().length === 0) {
    addAIMessage(props.emptyMessage)
  } else {
    rooms.value[0].typingUsers = [aiSenderId]
    key.value = newKeyValue()
    props.store.setQuestion(content)
    await props.sendPrompt()
    addAIMessage(props.store.gptResponse)
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