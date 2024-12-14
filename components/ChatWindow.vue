<script setup lang="ts">
import { register, type Room, type Message, type RoomUser, type UserStatus } from 'vue-advanced-chat'
register()

const currentUserId = '1234'

const userStatus: UserStatus = { state: 'online', lastChanged: "Never"}
const users: RoomUser[] = [
  { _id: "1", username: "AI Bot", avatar: 'https://i.pravatar.cc/100', status: userStatus }
]
const rooms: Room[] = [
  { roomId: '1', roomName: 'Ask AI', users: users, avatar: 'https://i.pravatar.cc/100'  }
]
const messages: Message[] = [
  { _id: "1", senderId: "1", content: "Hello!!", avatar:"https://i.pravatar.cc/100?u=1" }
]

const messagesLoaded = ref(false)

async function fetchMessages({ room, options = {} } : any) {
  console.log('featchMessages')
  messagesLoaded.value = true
}

</script>

<template>
  <vue-advanced-chat
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
  />
</template>