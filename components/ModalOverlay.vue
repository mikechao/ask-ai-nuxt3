<script setup lang="ts">
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-4 rounded flex flex-col items-center">
      <p class="text-gray-900 dark:text-white">{{ text }}</p>
      <div class="loader mt-4 mb-4"/>
    </div>
  </div>
</template>
<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4A5568; /* Tailwind's gray-700 */
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>