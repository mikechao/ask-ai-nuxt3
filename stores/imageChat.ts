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
  const imageWidth = ref(0)
  const imageHeight = ref(0)
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

  function getImageDescribeRequest(imageBase64: string) : ImageDescribeRequest {
    return {
      imageBase64: imageBase64,
      aiModel: settingStore.chatSettings.aiModel
    }
  }

  function getImageChatRequest(imageDescription: string, question: string) : ImageChatRequest {
    return {
      imageDescription: imageDescription,
      question: question,
      aiChatMode: settingStore.chatSettings.aiChatMode,
      aiModel: settingStore.chatSettings.aiModel
    }
  }

  async function describeImage() {
    if (file.value) {
      const imageBase64 = await useFileToBase64().toBase64(file.value)
      const res = await $fetch<ImageDescribeResponse>('/api/image/describe', {
        method: 'POST',
        body: JSON.stringify(getImageDescribeRequest(imageBase64)),
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
        body: JSON.stringify(getImageChatRequest(imageDescription.value, question.value)),
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
    imageHeight.value = 0
    imageWidth.value = 0
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
    imageWidth,
    imageHeight,
    setMessages,
    setQuestion
  }
})