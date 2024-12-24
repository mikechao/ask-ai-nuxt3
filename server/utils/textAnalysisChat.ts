import type { PromptTemplate, } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains"
import { getFirestoreChatMessageHistory } from "./firestoreChatHistory";
import type { LLMResult } from "@langchain/core/outputs";

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: runtimeConfig.openaiAPIKey,
})

export async function textAnalysis(inputs: string[], uid: string, prompt: PromptTemplate): Promise<TextChatResposne> {
  const chatHistory = getFirestoreChatMessageHistory(uid)
  
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history"
  });

  let totalTokens = 0

  const llmEndHandler = {
    handleLLMEnd(output: LLMResult) {
      // console.log(JSON.stringify(output, null, 2))
      // tokenUsage.totalTokens is specific to the model gpt-4o-mini
      totalTokens = output.llmOutput?.tokenUsage.totalTokens
    },
  }

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, })
  const joined = inputs.join('\n')
  const res = await chain.call({ input: joined }, { callbacks: [llmEndHandler]})

  return new Promise<TextChatResposne>((resolve) => {
    resolve({
      gptResponse: res.response,
      tokensUsed: totalTokens
    })
  })

}