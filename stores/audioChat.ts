export const useAudioChatStore = defineStore('audioChat', () => {
  const file = ref<File>()
  const prompt = ref<string[]>([])
  const gptResponse = ref<string>('')
  const transcript = ref<string>('')
  const question = ref<string>('')
  const clearFile = ref<boolean>(false)
  const isTranscribing = ref(false)
  const confidence = ref<number>(0)
  const tokensUsed = ref<number>(0)
  let includeTranscriptToAnalyze = true

  watch(transcript, (newTranscript, oldTranscript) => {
    if (newTranscript !== oldTranscript) {
      includeTranscriptToAnalyze = true
    }
  })

  watch(file, (newFile, oldFile) => {
    if (newFile?.name !== oldFile?.name) {
      transcript.value = ''
      confidence.value = 0
    }
  })

  async function fileToBase64(file: File) {
    const arrayBuffer = await fileToArrayBuffer(file) as ArrayBuffer
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )
    return base64
  }

  function fileToArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file)
    })
  }

  async function transcribeFile() {
    if (file.value) {
      const fileBase64 = await fileToBase64(file.value)
      isTranscribing.value = true
      $fetch<AudioTranscribeResposne>('/api/audio/transcribe', {
        method: 'POST',
        body: JSON.stringify({ fileBase64: fileBase64}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          if (!response.error) {
            transcript.value = response.transcript as string
            confidence.value = response.confidence as number
          }
          isTranscribing.value = false
        })
        .catch((error) => {
          console.error('Failed to transcribe audio', error)
          console.error('Error message', error.message)
          isTranscribing.value = false
        })
    }
  }

  function createPrompt() {
    const transcriptToAnalyze = 'Transcript to analyze\n' + transcript.value
    const chatQuestion = 'Question to answer\n' + question.value

    if (includeTranscriptToAnalyze) {
      prompt.value.push(transcriptToAnalyze)
      prompt.value.push(chatQuestion)
      includeTranscriptToAnalyze = false
    } else {
      prompt.value.length = 0
      prompt.value.push(chatQuestion)
    }
  }

  async function sendPrompt() {
    const res = await $fetch<TextChatResposne>('/api/audio/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: prompt.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    gptResponse.value = res.gptResponse
    tokensUsed.value = res.tokensUsed
  }
  
  function clearChat() {
    file.value = undefined
    prompt.value = []
    gptResponse.value = ''
    transcript.value = ''
    question.value = ''
    clearFile.value = false
    isTranscribing.value = false
    confidence.value = 0
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
    isTranscribing,
    confidence,
    tokensUsed
  }
})