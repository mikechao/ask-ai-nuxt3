<template>
    <LayoutPageWrapper class="flex-1 flex">
      <LayoutPageSection class="flex-1 flex flex-col mr-2 h-full">
        <h3>Choose audio that has some speech that you would like to ask questions about.</h3>
        <section class="my-4">
          <AudioFileUploader file-type="audio/*"/>
        </section>
      </LayoutPageSection>
      <LayoutPageSection class="flex-1 flex h-full">
        <TextChatWindow class="block w-full"/>
      </LayoutPageSection>
    </LayoutPageWrapper>
</template>