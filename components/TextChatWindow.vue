<script setup lang="ts">
import { register, type Room, type Message, type RoomUser, type UserStatus, } from 'vue-advanced-chat'
import { useTextChatStore } from '~/stores/textChat'
register()

const colorMode = useColorMode()

const textChatStore = useTextChatStore()
const userStore = useUserStore()

const currentUserId = '1234'
const userAvatar = userStore.getUserPhotoURL()

const userStatus: UserStatus = { state: 'online', lastChanged: "Never"}

const aiAvatar = "./aiAvatar.webp"
const aiSenderId = "1"
const users: RoomUser[] = [
  { _id: aiSenderId, username: "AI Bot", avatar: aiAvatar, status: userStatus },
  { _id: currentUserId, username: userStore.getUserName(), avatar: userAvatar, status: userStatus }
]
const rooms: Ref<Room[]> = ref([
  { roomId: '1', roomName: 'Ask AI', users: users, avatar: aiAvatar, }
])
const messageActions: string[] = []

let messageId = 1

const formattedDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
}).format(new Date())

const messages: Ref<Message[]> = ref([
  { _id: messageId.toString(), senderId: aiSenderId, content: "Hello! Type your question below and I will answer", 
  avatar: aiAvatar, date: formattedDate }
])

const messagesLoaded = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  // part of vue-advanced chat for when room is opened 
  // this funciton is called to get messages
  messagesLoaded.value = true
}

function addAIMessage(content: string) {
  messageId++
  const aiMessage = { _id: messageId.toString(), senderId: aiSenderId, content: content, avatar: aiAvatar, date: formattedDate}
  messages.value = [...messages.value, aiMessage]
}

function addUserMessage(content: string) {
  messageId++
  const userMessage = { _id: messageId.toString(), senderId: currentUserId, content: content, avatar: userAvatar, date: formattedDate}
  messages.value = [...messages.value, userMessage]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
  addUserMessage(content)
  if (textChatStore.text.length === 0) {
    addAIMessage("You did not give me any text to analyze")
  } else {
    textChatStore.question = content
    textChatStore.createPrompt()
    await textChatStore.sendPrompt()
    addAIMessage(textChatStore.gptResponse)
  }
}
</script>

<template>
  <vue-advanced-chat
    height="calc(100vh - 100px)"
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
    :current-user-id="currentUserId"
    @fetch-messages="fetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
  />
</template>