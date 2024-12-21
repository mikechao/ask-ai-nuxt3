<script setup lang="ts">
import TextChatWindow from '~/components/TextChatWindow.vue'

const textChatStore = useTextChatStore()
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <LayoutPageSection class="flex-1 flex flex-col mr-2 h-full">
      <h1>Enter the text you would like to ask questions about.</h1>
      <section class="mt-1 flex-1 flex">
        <textarea
          v-model="textChatStore.text"
          class="w-full h-full"
        />
      </section>
    </LayoutPageSection>
    <LayoutPageSection class="flex-1 flex h-full">
        <TextChatWindow class="block w-full h-full"/>
    </LayoutPageSection>
  </LayoutPageWrapper>
</template>