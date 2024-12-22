<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import useVueAdvancedChat from '~/composables/useVueAdvancedChat'
import { useAudioChatStore } from '~/stores/audioChat'
register()

const colorMode = useColorMode()
const vueAdvancedChat = useVueAdvancedChat()
const audioChatStore = useAudioChatStore()
const messagesLoaded = ref(false)

const { rooms, messages, messageActions, userId } = vueAdvancedChat

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMessages({ _room, _options = {} } : any) {
  // part of vue-advanced chat for when room is opened 
  // this funciton is called to get messages
  messagesLoaded.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage({ content }: any) {
}
</script>
<template>
  <vue-advanced-chat
    height="100%"
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