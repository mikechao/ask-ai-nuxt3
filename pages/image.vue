<script setup lang="ts">
import ImageFileUploader from '~/components/ImageFileUploader.vue';

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
        <ImageFileUploader/>
      </section>
      <div v-if="imageChatStore.imageURL.length > 0" class="flex-1 flex items-center justify-center">
        <img :src="imageChatStore.imageURL" alt="uploaded image" class="max-w-full max-h-full object-contain">
      </div>
    </div>
    <div class="flex-1 flex h-full">
      <AudioChatWindow :height="imageChatWindowHeight" class="block w-full"/>
    </div>
  </LayoutPageWrapper>
</template>