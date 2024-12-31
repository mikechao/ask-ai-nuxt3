<script setup>
const LayoutPageSection = defineAsyncComponent(() => import('../layers/nuxt-awesome/components/layouts/Page/Section/index.vue'))
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <LayoutPageSection class="flex-1 flex">
      <div class="flex-1 flex flex-col items-center justify-center">
        <AwesomeButton
          size="lg"
          text="Ask questions about written text"
          to="/text"
          class="font-extrabold mb-4"
        />
        <AwesomeButton
          size="lg"
          text="Ask questions about spoken language"
          to="/audio"
          class="font-extrabold mb-4"
        />
        <AwesomeButton
          size="lg"
          text="Ask questions about an image"
          to="/image"
          class="font-extrabold"
        />
      </div>
    </LayoutPageSection>
  </LayoutPageWrapper>
</template>