<script setup lang="ts">
const imageChatComponent = defineAsyncComponent(() => import('~/components/ImageChatWindow.vue'))
const imageChatStore = useImageChatStore()
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
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <div id="imageArea" class="flex-1 flex flex-col mr-2 h-full w-full">
      <h3>Choose an image that you would like to ask questions about.</h3>
      <section class="my-4">
        <LazyImageFileUploader/>
      </section>
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
      <h3 v-if="imageChatStore.tokensUsed > 0">Tokens used so far: {{ imageChatStore.tokensUsed }}</h3>
    </div>
    <div class="flex-1 flex h-full">
      <imageChatComponent :height="imageChatWindowHeight" class="block w-full"/>
    </div>
  </LayoutPageWrapper>
</template>