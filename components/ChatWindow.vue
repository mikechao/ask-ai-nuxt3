<script setup lang="ts">
import { register, type Room, type Message, type RoomUser, type UserStatus } from 'vue-advanced-chat'
register()

const colorMode = useColorMode()
console.log('ChatWindow colorMode', colorMode.preference)
const currentUserId = '1234'

const userStatus: UserStatus = { state: 'online', lastChanged: "Never"}
const users: RoomUser[] = [
  { _id: "1", username: "AI Bot", avatar: 'https://i.pravatar.cc/100', status: userStatus },
  { _id: "2", username: "Guest User", avatar: 'https://i.pravatar.cc/100', status: userStatus }
]
const rooms: Room[] = [
  { roomId: '1', roomName: 'Ask AI', users: users, avatar: 'https://i.pravatar.cc/100'  }
]
const messages: Message[] = [
  { _id: "1", senderId: "1", content: "Hello!!", avatar:"https://i.pravatar.cc/100?u=1" }
]

const messagesLoaded = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  // part of vue-advanced chat for when room is opened 
  // this funciton is called to get messages
  messagesLoaded.value = true
}

function sendMessage(content) {
  console.log('sendMessage content', content)
  console.log('typeof content', typeof content)
} 

</script>

<template>
  <vue-advanced-chat
    :theme="colorMode.preference"
    :messages-loaded="messagesLoaded"
    :rooms-loaded="true"
    :single-room="true"
    :show-search="false"
    :show-add-room="true"
    :show-files="false"
    :show-audio="false"
    :show-emojis="false"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :current-user-id="currentUserId"
    @fetch-messages="fetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
  />
</template>