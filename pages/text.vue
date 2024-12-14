<template>
  <LayoutPageWrapper class="flex-1 flex">
    <LayoutPageSection class="flex-1 flex flex-col mr-2">
      <h1>Enter the text you would like to ask questions about.</h1>
      <section class="mt-2">
        <textarea
          rows="20"
        />
      </section>
    </LayoutPageSection>
    <LayoutPageSection class="flex-1 flex">
        <ChatWindow />
    </LayoutPageSection>
  </LayoutPageWrapper>
</template>