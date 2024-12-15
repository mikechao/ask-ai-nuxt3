<script setup lang="ts">
import TextChatWindow from '~/components/TextChatWindow.vue'
import { useTextChatStore } from '~/stores/textChat'

const textChatStore = useTextChatStore()
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <LayoutPageSection class="flex-1 flex flex-col mr-2 h-full">
      <h1>Enter the text you would like to ask questions about.</h1>
      <section class="mt-2">
        <textarea
          v-model="textChatStore.text"
          rows="20"
        />
      </section>
    </LayoutPageSection>
    <LayoutPageSection class="flex-1 flex h-full">
        <TextChatWindow class="block w-full"/>
    </LayoutPageSection>
  </LayoutPageWrapper>
</template>