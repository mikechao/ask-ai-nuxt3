import useFileToBase64 from "~/composables/useFileToBase64"
import type { Message } from 'vue-advanced-chat'

export const useImageChatStore = defineStore('imageChat', () => {
  const file = ref<File>()
  const prompt = ref<string[]>([])
  const gptResponse = ref<string>('')
  const question = ref<string>('')
  const clearFile = ref<boolean>(false)
  const imageDescription = ref<string>('')
  const imageURL = computed(() => {
    if (file.value) {
      const objectURL = useObjectUrl(file)
      return objectURL.value as string
    } else {
      return ''
    }
  })
  const messages: Ref<Message[]> = ref([])
  const tokenStore = useTokenStore()
  const settingStore = useSettingStore()

  watch(imageURL, (newImageURL, oldImageURL) => {
    if (newImageURL !== oldImageURL) {
      imageDescription.value = ''
    }
  })

  function setMessages(newMessages: Message[]) {
    messages.value = [...newMessages]
  }

  function setQuestion(newQuestion: string) {
    question.value = newQuestion
  }

  async function describeImage() {
    if (file.value) {
      const imageBase64 = await useFileToBase64().toBase64(file.value)
      const res = await $fetch<ImageDescribeResponse>('/api/image/describe', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: imageBase64 }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      imageDescription.value = res.imageDescription
      tokenStore.addImageDescriptionTokensUsed(res.tokensUsed)
    } else {
      console.log('No file to describe')
    }
  }

  async function sendPrompt() {
    if (file.value) {
      if (imageDescription.value.length === 0) {
        await describeImage()
      }

      const res = await $fetch<TextChatResposne>('/api/image/chat', {
        method: 'POST',
        body: JSON.stringify({ imageDescription: imageDescription.value, 
          question: question.value,
          aiChatMode: settingStore.chatSettings.aiChatMode}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      gptResponse.value = res.gptResponse
      tokenStore.addImageChatTokensUsed(res.tokensUsed)
    } else {
      console.log('No file to send')
    }
  }

  async function clearChat() {
    file.value = undefined
    prompt.value = []
    gptResponse.value = ''
    question.value = ''
    clearFile.value = false
    imageDescription.value = ''
    messages.value = []
  }

  return {
    file,
    question,
    imageURL,
    gptResponse,
    clearFile,
    clearChat,
    sendPrompt,
    imageDescription,
    messages,
    setMessages,
    setQuestion
  }
})