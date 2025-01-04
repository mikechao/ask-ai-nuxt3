import { BufferMemory } from "langchain/memory";
import { getFirestoreChatMessageHistory } from "../../utils/firestoreChatHistory";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains"
import type { LLMResult } from "@langchain/core/outputs";
import { AIModel } from "~/types/enums";
import type { AIMessage } from "@langchain/core/messages";


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

  const { imageDescription, question, aiChatMode, aiModel } = body as ImageChatRequest

  const chatHistory = getFirestoreChatMessageHistory(token)
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history",
      inputKey: "input"
  });

  let totalTokens = 0

  const llmEndHandler = {
    handleLLMEnd(output: LLMResult) {
      // console.log('output', JSON.stringify(output, null, 2))
      if (aiModel === AIModel.GPT_4o_mini) {
        // tokenUsage.totalTokens is specific to the model gpt-4o-mini
        totalTokens = output.llmOutput?.tokenUsage.totalTokens
      } else {
        const generation = output.generations[0][0]
        if ('message' in generation) {
          const message = generation.message as AIMessage
          if (message.usage_metadata?.total_tokens) {
            totalTokens = message.usage_metadata?.total_tokens
          }
        }
      }
    },
  }

  const llm = getLanguageModel(aiModel)

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, verbose: false})

  const input = "Image Description:\n" + imageDescription + "\nQuestion to answer:\n" + question

  const res = await chain.call({ input: input, aiChatMode: aiChatMode }, { callbacks: [llmEndHandler] })

  // console.log('res', res)

  return {
    gptResponse: res.response.replace(/\n$/, ''),
    tokensUsed: totalTokens
  }
})