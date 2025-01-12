<script setup lang="ts">
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.client.vue'))
const audioAreaHeight = ref(0)
const audioChatWindowHeight = computed(() => {
  return `${audioAreaHeight.value}px`
})

const audioChatStore = useAudioChatStore()
const tokenStore = useTokenStore()
const audioArea = ref(null)

useResizeObserver(audioArea, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  audioAreaHeight.value = height
})

function getContent() {
  return audioChatStore.transcript
}

async function sendPrompt() {
  audioChatStore.createPrompt()
  await audioChatStore.sendPrompt()
}
</script>
<template>
    <LayoutPageWrapper class="flex-1 flex max-sm:flex-col">
      <div ref="audioArea" class="flex-1 flex flex-col mr-2 h-full max-sm:mb-1">
        <h1 class="max-sm:text-sm">Choose audio that has some speech that you would like to ask questions about.</h1>
        <section class="mt-4">
          <LazyAudioFileUploader file-type="audio/*"/>
        </section>
        <LazyAudioTranscribe class="h-full"/>
        <div class="flex space-x-4 max-sm:justify-between">
          <h3 v-if="tokenStore.state.audioTokens > 0" class="max-sm:text-sm">Tokens for audio: {{ tokenStore.state.audioTokens}}</h3>
          <h3 v-if="tokenStore.totalTokens > 0" class="max-sm:text-sm">Total tokens: {{ tokenStore.totalTokens }}</h3>
        </div>
      </div>
      <div class="flex-1 flex h-full">
        <ClientOnly>
          <ChatWindow 
          :height="audioChatWindowHeight"
          :store="audioChatStore"
          initial-message="Hello click the Choose File button to select an audio file, then hit the Transcribe button and ask your question below."
          empty-message="You did not give me any audio to analyze"
          :get-content="getContent"
          :send-prompt="sendPrompt"
          class="block w-full"
          />
        </ClientOnly>
      </div>
    </LayoutPageWrapper>
</template>