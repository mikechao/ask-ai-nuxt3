export const useAudioChatStore = defineStore('audioChat', () => {
  const file = ref<File>()
  const prompt = ref([])
  const gptResponse = ref('')
  const transcript = ref('')
  const question = ref('')
  const clearFile = ref<boolean>(false)

  function transcribeFile() {
    if (file.value) {
      const formData = new FormData()
      formData.append("file", file.value)
      const resposne = $fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData
      })
      console.log('response', resposne)
    }
  }

  function createPrompt() {
  }

  function sendPrompt() {
  }
  
  function clearChat() {
    file.value = undefined
    prompt.value = []
    gptResponse.value = ''
    transcript.value = ''
    question.value = ''
    clearFile.value = true
    // clear memory in server:
  }

  return {
    prompt,
    createPrompt,
    sendPrompt,
    gptResponse,
    file,
    transcribeFile,
    transcript,
    question,
    clearChat,
    clearFile,
  }
})