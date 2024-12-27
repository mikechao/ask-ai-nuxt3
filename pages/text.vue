<script setup lang="ts">
import TextChatWindow from '~/components/TextChatWindow.vue'

const textChatStore = useTextChatStore()
const textAreaHeight = ref(0)
const textChatWindowHeight = computed(() => {
  return `${textAreaHeight.value}px`
})

function observeHeight() {
  const resizeObserver = new ResizeObserver(function(entries: ResizeObserverEntry[]) {
    const textArea = entries[0]
    const cr = textArea.contentRect
    textAreaHeight.value = cr.height
  });
  const textAreaEl = document.getElementById('textArea') as Element
  resizeObserver.observe(textAreaEl);
}

onMounted(() => {
  observeHeight()
})
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <div id="textArea" class="flex-1 flex flex-col mr-2 h-full">
      <h1>Enter the text you would like to ask questions about.</h1>
      <section class="mt-1 flex-1 flex">
        <textarea
          v-model="textChatStore.text"
          class="w-full h-full resize-none"
        />
      </section>
      <h1 v-if="textChatStore.tokensUsed > 0">Tokens used so far: {{ textChatStore.tokensUsed }}</h1>
    </div>
    <div class="flex-1 flex h-full">
        <TextChatWindow :height="textChatWindowHeight" class="block w-full h-full"/>
    </div>
  </LayoutPageWrapper>
</template>