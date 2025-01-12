<script lang="ts" setup>
const { awesome } = useAppConfig()
const seoDescription = `Chat with an AI that remembers text, audio, and images. 
    It answers questions in any style—whether as an assistant, pirate, or Yoda—with context-aware, personalized responses.`

useHead({
  title: awesome.name,
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})

useSeoMeta({
  title: awesome.name,
  description: awesome.description,
  author: 'Mike Chao',
  applicationName: 'Ask AI',
  ogTitle: awesome.name,
  ogDescription: seoDescription,
  ogType: 'website',
  ogImage: { 
    url: 'https://ask-ai-n3.netlify.app/askAISample.png',
    alt: 'A textbox on the left with a poem and a chat window o the right about it',
    type: 'image/png',
    width: 1884,
    height: 774
  },
  ogUrl: 'https://ask-ai-n3.netlify.app',
  twitterTitle: awesome.name,
  twitterDescription: seoDescription,
  twitterImage: { 
    url: 'https://ask-ai-n3.netlify.app/askAISample.png',
    alt: 'A textbox on the left with a poem and a chat window o the right about it'
  },
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <Body
    class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950"
  >
    <NuxtLayout>
      <LazyNuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>