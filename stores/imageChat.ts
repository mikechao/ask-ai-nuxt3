export const useImageChatStore = defineStore('imageChat', () => {
  const file = ref<File>()
  const prompt = ref<string[]>([])
  const gptResponse = ref<string>('')
  const question = ref<string>('')
  const clearFile = ref<boolean>(false)

  function clearChat() {
    file.value = undefined
    prompt.value = []
    gptResponse.value = ''
    question.value = ''
    clearFile.value = true
  }

  return {
    file,
    clearFile,
    clearChat
  }
})