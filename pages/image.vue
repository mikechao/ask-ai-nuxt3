<script setup lang="ts">
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const ChatWindow = defineAsyncComponent(() => import('~/components/ChatWindow.vue'))
const imageChatStore = useImageChatStore()
const tokenStore = useTokenStore()
const imageAreaHeight = ref(0)
const imageChatWindowHeight = computed(() => {
  return `${imageAreaHeight.value}px`
})

function observeHeight() {
  const resizeObserver = new ResizeObserver(function(entries: ResizeObserverEntry[]) {
    const imageArea = entries[0]
    const cr = imageArea.contentRect
    imageAreaHeight.value = cr.height
  });
  const imageAreaEl = document.getElementById('imageArea') as Element
  resizeObserver.observe(imageAreaEl);
}

onMounted(() => {
  observeHeight()
})

function getContent() {
  return imageChatStore.imageURL
}

async function sendPrompt() {
  await imageChatStore.sendPrompt()
}
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <div id="imageArea" class="flex-1 flex flex-col mr-2 h-full w-full">
      <h3>Choose an image that you would like to ask questions about.</h3>
      <section class="my-4">
        <LazyImageFileUploader/>
      </section>
      <div class="h-full">
        <div v-if="imageChatStore.imageURL.length > 0" class="flex-1 flex items-start justify-start">
          <img :src="imageChatStore.imageURL" alt="uploaded image" class="max-w-full max-h-full object-contain">
        </div>
        <div v-if="imageChatStore.imageDescription.length > 0" class="mt-0 flex-1 flex flex-col">
          <h3 class="my-2">What the AI sees</h3>
          <textarea 
          v-model="imageChatStore.imageDescription"
          readonly
          class="w-full flex-1 resize-none overflow-y-auto"
          />
        </div>
      </div>
      <div class="flex space-x-4">
        <h3 v-if="tokenStore.imageTokens> 0">Tokens used for image: {{ tokenStore.imageTokens }}</h3>
        <h3 v-if="tokenStore.totalTokens > 0">Total tokens used: {{ tokenStore.totalTokens }}</h3>
      </div>
    </div>
    <div class="flex-1 flex h-full">
      <ChatWindow 
        :height="imageChatWindowHeight"
        :store="imageChatStore"
        initial-message="Hello add an image to the left and ask questions below and I will answer to the best of my ability"
        empty-message="You did not give me any image to analyze"
        :get-content="getContent"
        :send-prompt="sendPrompt"
        class="block w-full"
      />
    </div>
  </LayoutPageWrapper>
</template>