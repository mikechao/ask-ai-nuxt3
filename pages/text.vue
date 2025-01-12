<script setup lang="ts">
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.client.vue'))
const textChatStore = useTextChatStore()
const tokenStore = useTokenStore()
const textAreaHeight = ref(0)
const textChatWindowHeight = computed(() => {
  return `${textAreaHeight.value}px`
})
const textArea = ref(null)

useResizeObserver(textArea, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  textAreaHeight.value = height
})

function getContent() {
  return textChatStore.text
}

async function sendPrompt() {
  textChatStore.createPrompt()
  await textChatStore.sendPrompt()
}
</script>
<template>
  <LayoutPageWrapper class="flex-1 flex max-sm:flex-col">
    <div ref="textArea" class="flex-1 flex flex-col mr-2 h-full max-sm:mb-1">
      <h1 class="max-sm:text-sm">Enter the text you would like to ask questions about.</h1>
      <section class="mt-1 flex-1 flex">
        <textarea
          v-model="textChatStore.text"
          class="w-full h-full resize-none"
        />
      </section>
      <div class="flex space-x-4">
        <h1 v-if="tokenStore.state.textTokens > 0">Tokens used for text: {{ tokenStore.state.textTokens }}</h1>
        <h1 v-if="tokenStore.totalTokens > 0">Total tokens used: {{ tokenStore.totalTokens }}</h1>
      </div>
    </div>
    <div class="flex-1 flex h-full">
      <ClientOnly>
        <ChatWindow 
        :height="textChatWindowHeight"
        :store="textChatStore"
        initial-message="Hello add some text to the left and ask questions below and I will answer to the best of my ability"
        empty-message="You did not give me any text to analyze"
        :get-content="getContent"
        :send-prompt="sendPrompt"
        class="block w-full h-full"
        />
      </ClientOnly>
    </div>
  </LayoutPageWrapper>
</template>