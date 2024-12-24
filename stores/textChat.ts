export const useTextChatStore = defineStore('textChat', () => {
  // text we want openai to analyze
  const text = ref<string>('')

  // quest we want to ask openai about the text
  const question = ref<string>('')

  // prompt built as the message array
  const prompt = ref<string[]>([])

  // reponse from open ai
  const gptResponse = ref<string>('')

  // the number of tokens used so far
  const tokensUsed = ref(0)

  let includeTextToAnalyze = true

  watch(text, (newText, oldText) => {
    if (newText !== oldText) {
      includeTextToAnalyze = true
    }
  })

  // generate prompt for AI request
  function createPrompt() {
    const textToAnalyze = 'Text to analyze\n' + text.value
    const chatQuestion = 'Question to answer\n' + question.value
 
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
    const res = await $fetch<TextChatResposne>('/api/text/chat', {
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

  // Resets the chat data
  function clearChat() {
    text.value = ''
    question.value = ''
    prompt.value = []
    gptResponse.value = ''
    includeTextToAnalyze = true
    tokensUsed.value = 0
  }

  return { text, question, prompt, gptResponse, tokensUsed, createPrompt, sendPrompt, clearChat }
})
