export const useImageChatStore = defineStore('imageChat', () => {
  const file = ref<File>()
  const prompt = ref<string[]>([])
  const gptResponse = ref<string>('')
  const question = ref<string>('')
  const clearFile = ref<boolean>(false)
  const imageDescription = ref<string>('')
  const imageDescriptionTokensUsed = ref<number>(0)
  const chatTokensUsed = ref<number>(0)
  const imageURL = computed(() => {
    if (file.value) {
      const objectURL = useObjectUrl(file)
      return objectURL.value as string
    } else {
      return ''
    }
  })
  const tokensUsed = computed(() => {
    return imageDescriptionTokensUsed.value + chatTokensUsed.value
  })

  watch(imageURL, (newImageURL, oldImageURL) => {
    if (newImageURL !== oldImageURL) {
      imageDescription.value = ''
    }
  })

  async function imageFileToBase64(file: File) {
    const arrayBuffer = await imageFileToArrayBuffer(file) as ArrayBuffer
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )
    return base64
  }

  function imageFileToArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file)
    })
  }

  async function describeImage() {
    if (file.value) {
      const imageBase64 = await imageFileToBase64(file.value)
      const res = await $fetch<ImageDescribeResponse>('/api/image/describe', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: imageBase64 }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      imageDescription.value = res.imageDescription
      imageDescriptionTokensUsed.value = res.tokensUsed
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
        body: JSON.stringify({ imageDescription: imageDescription.value, question: question.value}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      gptResponse.value = res.gptResponse
      chatTokensUsed.value = res.tokensUsed
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
    imageDescriptionTokensUsed.value = 0
    chatTokensUsed.value = 0
  }

  return {
    file,
    question,
    imageURL,
    gptResponse,
    clearFile,
    clearChat,
    sendPrompt,
    tokensUsed,
    imageDescription
  }
})