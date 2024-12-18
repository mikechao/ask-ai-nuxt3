export const useTextChatStore = defineStore('textChat', () => {
  // text we want openai to analyze
  const text = ref('')

  // quest we want to ask openai about the text
  const question = ref('')

  // prompt built as the message array
  const prompt = ref([])

  // reponse from open ai
  const gptResponse = ref('')

  // generate prompt for AI request
  function createPrompt() {
    const textToAnalyze = text.value
    const chatQuestion = question.value
 
    if (gptResponse.value.length === 0) {
      // if we haven't gotten a response yet include textToAnalyze
      prompt.value.push(textToAnalyze)
      prompt.value.push(chatQuestion)
    } else {
      // else clear out the prompt and just send the chatQuestion
      prompt.value.length = 0
      prompt.value.push(chatQuestion)
    }

  }

  // sends prompt and recevies the AI-generated response
  async function sendPrompt() {
    if (text.value.length === 0) {
      alert('You have not added any text to analyze.')
    } else {
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
  }

  // Resets the chat data
  function clearChat() {
    text.value = ''
    question.value = ''
    prompt.value = []
    gptResponse.value = ''
  }

  return { text, question, prompt, gptResponse, createPrompt, sendPrompt, clearChat }
})
