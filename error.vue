<script setup lang="ts">
import type { NuxtError } from '#app'

const LayoutPageSection = defineAsyncComponent(() => import('./layers/nuxt-awesome/components/layouts/Page/Section/index.vue'))
const LayoutPageWrapper = defineAsyncComponent(() => import('./layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
useUserStore()

defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({ statusCode: 500, message: 'An error occurred' })
  }
})

const handleError = () => {
  clearError({
    redirect: '/',
  });
};

</script>

<template>
  <Body
    class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950"
  >
    <NuxtLayout>
      <LayoutPageWrapper class="flex-1 flex">
        <LayoutPageSection class="flex-1 flex">
          <div class="flex-1 flex flex-col items-center justify-center">
            <template v-if="error.statusCode === 404">
              <h1>404!</h1>
              <p>Sorry, that page doesn't exist.</p>
            </template>
            <template v-else>
              <h1>Dang</h1>
                <p>
                  <strong>{{ error.message }}</strong>
                </p>
                <p>It looks like something broke.</p>
                <p>Sorry about that.</p>
            </template>
            <AwesomeButton
              size="md"
              text="Back to Home"
              class="font-extrabold mb-4 mt-4"
              @click="handleError"
            />
          </div>
        </LayoutPageSection>
      </LayoutPageWrapper>
    </NuxtLayout>
  </Body>
</template>