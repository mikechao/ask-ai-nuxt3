import { BufferMemory } from "langchain/memory";
import { getFirestoreChatMessageHistory } from "../../utils/firestoreChatHistory";
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains"
import type { LLMResult } from "@langchain/core/outputs";

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: runtimeConfig.openaiAPIKey
})

const template = `
  You are a helpful AI assistant. 
  You will answer questions about the following text that is a description of
  an user uploaded image. You will keep reponses short as if you are replying in a online chat.
  Do not include "AI:" in your responses.
  You will respond as if you are {aiChatMode}
  The image description is under "Image Description:"
  The question to answer is under "Question to answer:"
  Current conversation: {chat_history}
  {input}
  `

const prompt = new PromptTemplate({
    inputVariables: ["input", "aiChatMode", "chat_history"],
    template: template
})

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const token = getCookie(event, 'token') as string

  const { imageDescription, question, aiChatMode } = body as ImageChatRequest

  const chatHistory = getFirestoreChatMessageHistory(token)
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history",
      inputKey: "input"
  });

  let totalTokens = 0

  const llmEndHandler = {
    handleLLMEnd(output: LLMResult) {
      // console.log(JSON.stringify(output, null, 2))
      // tokenUsage.totalTokens is specific to the model gpt-4o-mini
      totalTokens = output.llmOutput?.tokenUsage.totalTokens
    },
  }

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, verbose: false})

  const input = "Image Description:\n" + imageDescription + "\nQuestion to answer:\n" + question

  const res = await chain.call({ input: input, aiChatMode: aiChatMode }, { callbacks: [llmEndHandler] })

  // console.log('res', res)

  return {
    gptResponse: res.response,
    tokensUsed: totalTokens
  }
})