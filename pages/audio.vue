<script setup lang="ts">
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.vue'))
const audioAreaHeight = ref(0)
const audioChatWindowHeight = computed(() => {
  return `${audioAreaHeight.value}px`
})

const audioChatStore = useAudioChatStore()
const tokenStore = useTokenStore()

function observeHeight() {
  const resizeObserver = new ResizeObserver(function(entries: ResizeObserverEntry[]) {
    const textArea = entries[0]
    const cr = textArea.contentRect
    audioAreaHeight.value = cr.height
  });
  const textAreaEl = document.getElementById('audioArea') as Element
  resizeObserver.observe(textAreaEl);
}

onMounted(() => {
  observeHeight()
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
    <LayoutPageWrapper class="flex-1 flex">
      <div id="audioArea" class="flex-1 flex flex-col mr-2 h-full">
        <h3>Choose audio that has some speech that you would like to ask questions about.</h3>
        <section class="mt-4">
          <LazyAudioFileUploader file-type="audio/*"/>
        </section>
        <LazyAudioTranscribe class="h-full"/>
        <div class="flex space-x-4">
          <h3 v-if="tokenStore.state.audioTokens > 0">Tokens used for audio: {{ tokenStore.state.audioTokens}}</h3>
          <h1 v-if="tokenStore.totalTokens > 0">Total tokens used: {{ tokenStore.totalTokens }}</h1>
        </div>
      </div>
      <div class="flex-1 flex h-full">
        <ChatWindow 
          :height="audioChatWindowHeight"
          :store="audioChatStore"
          initial-message="Hello click the Choose File button to select an audio file, then hit the Transcribe button and ask your question below."
          empty-message="You did not give me any audio to analyze"
          :get-content="getContent"
          :send-prompt="sendPrompt"
          class="block w-full"
        />
      </div>
    </LayoutPageWrapper>
</template>