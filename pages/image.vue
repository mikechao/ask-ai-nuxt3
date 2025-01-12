<script setup lang="ts">
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.client.vue'))
const imageChatStore = useImageChatStore()
const tokenStore = useTokenStore()
const imageAreaHeight = ref(0)
const imageChatWindowHeight = computed(() => {
  return `${imageAreaHeight.value}px`
})
const imageArea = ref(null)
const imageWidthHeightClass = computed(() => `max-w-[${imageChatStore.imageWidth}px] max-h-[${imageChatStore.imageHeight}px]`)

useResizeObserver(imageArea, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  imageAreaHeight.value = height
})

function getContent() {
  return imageChatStore.imageURL
}

async function sendPrompt() {
  await imageChatStore.sendPrompt()
}
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex max-sm:flex-col max-sm:py-0">
    <div ref="imageArea" class="flex-1 flex flex-col mr-2 h-full w-full max-sm:mb-1">
      <h3 class="max-sm:text-sm">Choose an image that you would like to ask questions about.</h3>
      <section class="my-4 max-sm:my-2">
        <LazyImageFileUploader/>
      </section>
      <div class="flex-1 flex flex-row h-full">
        <div v-if="imageChatStore.imageURL.length > 0" class="items-start justify-start" :class="imageWidthHeightClass">
          <img :src="imageChatStore.imageURL" alt="uploaded image" class="object-contain">
        </div>
        <div v-if="imageChatStore.imageDescription.length > 0" class="mt-0 flex-1 flex flex-col ml-2">
          <textarea 
            v-model="imageChatStore.imageDescription"
            readonly
            class="w-full flex-1 resize-none overflow-auto"
          />
        </div>
      </div>
      <div class="flex space-x-4 max-sm:space-x-1">
        <h3 v-if="tokenStore.imageTokens > 0" class="max-sm:text-sm">Tokens for image: {{ tokenStore.imageTokens }}</h3>
        <h3 v-if="tokenStore.totalTokens > 0" class="max-sm:text-sm">Total tokens: {{ tokenStore.totalTokens }}</h3>
      </div>
    </div>
    <div class="flex-1 flex h-full">
      <ClientOnly>
        <ChatWindow 
        :height="imageChatWindowHeight"
        :store="imageChatStore"
        initial-message="Hello add an image to the left and ask questions below and I will answer to the best of my ability"
        empty-message="You did not give me any image to analyze"
        :get-content="getContent"
        :send-prompt="sendPrompt"
        class="block w-full"
        />
      </ClientOnly>
    </div>
  </LayoutPageWrapper>
</template>