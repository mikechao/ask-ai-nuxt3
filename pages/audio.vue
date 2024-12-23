<script setup lang="ts">
const audioAreaHeight = ref(0)
const audioChatWindowHeight = computed(() => {
  return `${audioAreaHeight.value}px`
})

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
</script>
<template>
    <LayoutPageWrapper class="flex-1 flex">
      <div id="audioArea" class="flex-1 flex flex-col mr-2 h-full">
        <h3>Choose audio that has some speech that you would like to ask questions about.</h3>
        <section class="my-4">
          <AudioFileUploader file-type="audio/*"/>
        </section>
        <AudioTranscribe />
      </div>
      <div class="flex-1 flex h-full">
        <AudioChatWindow :height="audioChatWindowHeight" class="block w-full"/>
      </div>
    </LayoutPageWrapper>
</template>