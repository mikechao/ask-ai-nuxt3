<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-lg">
      <p class="text-gray-900 dark:text-white">Logging in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
})
</script>