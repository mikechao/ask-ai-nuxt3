export const useImageChatStore = defineStore('imageChat', () => {
  const file = ref<File>()
  const prompt = ref<string[]>([])
  const gptResponse = ref<string>('')
  const question = ref<string>('')
  const clearFile = ref<boolean>(false)
  const imageURL = computed(() => {
    return file.value ? URL.createObjectURL(file.value) : ''
  })

  function clearChat() {
    file.value = undefined
    prompt.value = []
    gptResponse.value = ''
    question.value = ''
    clearFile.value = true
  }

  return {
    file,
    imageURL,
    clearFile,
    clearChat
  }
})