export const useAudioChatStore = defineStore('audioChat', () => {
  const file = ref<File>()
  const prompt = ref([])
  const gptResponse = ref('')
  const transcript = ref('')
  const question = ref('')
  const clearFile = ref<boolean>(false)
  const isTranscribing = ref(false)

  function transcribeFile() {
    if (file.value) {
      const formData = new FormData()
      formData.append("file", file.value)
      isTranscribing.value = true
      $fetch<AudioTranscribeResposne>('/api/audio/transcribe', {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          if (!response.error) {
            transcript.value = response.transcript as string
          }
          isTranscribing.value = false
        })
    }
  }

  function createPrompt() {
  }

  async function sendPrompt() {
  }
  
  function clearChat() {
    file.value = undefined
    prompt.value = []
    gptResponse.value = ''
    transcript.value = ''
    question.value = ''
    clearFile.value = true
    isTranscribing.value = false
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
    isTranscribing
  }
})