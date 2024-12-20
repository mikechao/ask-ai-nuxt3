export const useTextChatStore = defineStore('textChat', () => {
  // text we want openai to analyze
  const text = ref('')

  // quest we want to ask openai about the text
  const question = ref('')

  // prompt built as the message array
  const prompt = ref([])

  // reponse from open ai
  const gptResponse = ref('')

  let includeTextToAnalyze = true

  watch(text, (newText, oldText) => {
    if (newText !== oldText) {
      includeTextToAnalyze = true
    }
  })

  // generate prompt for AI request
  function createPrompt() {
    const textToAnalyze = text.value
    const chatQuestion = question.value
 
    if (includeTextToAnalyze) {
      prompt.value.push(textToAnalyze)
      prompt.value.push(chatQuestion)
      includeTextToAnalyze = false
    } else {
      // else clear out the prompt and just send the chatQuestion
      prompt.value.length = 0
      prompt.value.push(chatQuestion)
    }

  }

  // sends prompt and recevies the AI-generated response
  async function sendPrompt() {
    const res = await $fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: prompt.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    gptResponse.value = res.gptResponse
  }

  // Resets the chat data
  function clearChat() {
    text.value = ''
    question.value = ''
    prompt.value = []
    gptResponse.value = ''
    includeTextToAnalyze = true
  }

  return { text, question, prompt, gptResponse, createPrompt, sendPrompt, clearChat }
})
