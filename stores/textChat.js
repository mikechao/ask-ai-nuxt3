export const useTextChatStore = defineStore('textChat', () => {
  // text we want openai to analyze
  const text = ref('')

  // quest we want to ask openai about the text
  const question = ref('')

  // prompt built as the message array
  const prompt = ref([])

  // reponse from open ai
  const gptResponse = ref('')

  const questionAnswerList = ref([])

  // generate prompt for AI request
  function createPrompt() {
    const textToAnalyze = { role: 'user', content: text.value }
    const chatQuestion = { role: 'user', content: question.value }
 
    if (questionAnswerList.value.length === 0) {
      // if there hasn't been any questions and answers send the textToanalyze
      // and the chatQuestion
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
      console.log('res', res)
      gptResponse.value = res.gptResponse
      questionAnswerList.value.push({
        question: question.value,
        answer: res.gptResponse
      })
    }
  }

  // Resets the chat data
  function clearChat() {
    text.value = ''
    question.value = ''
    prompt.value = []
    gptResponse.value = ''
    questionAnswerList.value = []
  }

  return { text, question, prompt, gptResponse, createPrompt, sendPrompt, clearChat, questionAnswerList }
})
