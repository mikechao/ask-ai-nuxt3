export const useImageChatStore = defineStore('imageChat', () => {
  const file = ref<File>()
  const prompt = ref<string[]>([])
  const gptResponse = ref<string>('')
  const question = ref<string>('')
  const clearFile = ref<boolean>(false)
  const imageURL = computed(() => {
    return file.value ? URL.createObjectURL(file.value) : ''
  })
  
  let includeImage = true

  watch(imageURL, (newImageURL, oldImageURL) => {
    if (newImageURL !== oldImageURL) {
      includeImage = true
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

  async function sendPrompt() {
    if (file.value) {
      let body = ''
      if (includeImage) {
        const imageBase64 = await imageFileToBase64(file.value)
        body = JSON.stringify({
          imageBase64,
          question: question.value
        })
        includeImage = false
      } else {
        body = JSON.stringify({
          question: question.value
        })
      }
      const res = await $fetch<TextChatResposne>('/api/image/chat', {
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      gptResponse.value = res.gptResponse
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
  }

  return {
    file,
    question,
    imageURL,
    gptResponse,
    clearFile,
    clearChat,
    sendPrompt
  }
})