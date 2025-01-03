import type { PromptTemplate, } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains"
import { getFirestoreChatMessageHistory } from "./firestoreChatHistory";
import type { LLMResult } from "@langchain/core/outputs";
import { AIModel } from "~/types/enums";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const runtimeConfig = useRuntimeConfig()

const gpt4oMini = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: runtimeConfig.openaiAPIKey,
})

const geminiPro = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro',
  temperature: 0,
  apiKey: runtimeConfig.googleAPIKey,
})

export async function textAnalysis(textChatRequest: TextChatRequest, uid: string, prompt: PromptTemplate): Promise<TextChatResposne> {
  const chatHistory = getFirestoreChatMessageHistory(uid)
  
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
  console.log('Using AI Model', textChatRequest.aiModel)
  const llm = textChatRequest.aiModel === AIModel.GPT_4o_mini ? gpt4oMini : geminiPro;
  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, })
  const inputs = textChatRequest.messages
  const joined = inputs.join('\n')
  const res = await chain.call({ input: joined, aiChatMode: textChatRequest.aiChatMode }, { callbacks: [llmEndHandler]})

  return new Promise<TextChatResposne>((resolve) => {
    resolve({
      gptResponse: res.response,
      tokensUsed: totalTokens
    })
  })

}