<script setup>
const LayoutPageSection = defineAsyncComponent(() => import('../layers/nuxt-awesome/components/layouts/Page/Section/index.vue'))
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <LayoutPageSection class="flex-1 flex">
      <div class="flex-1 flex flex-col items-center justify-center ">
        <AwesomeButton
          size="lg"
          to="/text"
          class="font-extrabold mb-4 max-sm:w-full max-sm:text-center max-sm:px-4 text-center"
        >
          <span class="max-sm:text-base">Ask questions about written text</span>
        </AwesomeButton>
        <AwesomeButton
          size="lg"
          to="/audio"
          class="font-extrabold mb-4 max-sm:w-full max-sm:text-center max-sm:px-4 text-center"
        >
          <span class="max-sm:text-base">Ask questions about spoken language</span>
        </AwesomeButton>
        <AwesomeButton
          size="lg"
          to="/image"
          class="font-extrabold max-sm:w-full max-sm:text-center max-sm:px-4 text-center"
        >
          <span class="max-sm:text-base">Ask questions about an image</span>
        </AwesomeButton>
      </div>
    </LayoutPageSection>
  </LayoutPageWrapper>
</template>