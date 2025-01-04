import type { PromptTemplate, } from "@langchain/core/prompts"
import type { LLMResult } from "@langchain/core/outputs";
import type { AIMessage } from "@langchain/core/messages";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains"
import { getFirestoreChatMessageHistory } from "./firestoreChatHistory";
import { AIModel } from "~/types/enums";
import { getLanguageModel } from "./getLanguageModel";

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
      // console.log('output', JSON.stringify(output, null, 2))
      if (textChatRequest.aiModel === AIModel.GPT_4o_mini) {
        // tokenUsage.totalTokens is specific to the model gpt-4o-mini
        totalTokens = output.llmOutput?.tokenUsage.totalTokens
      } else {
        const generation = output.generations[0][0]
        if ('message' in generation) {
          const message = generation.message as AIMessage
          console.log('message', message)
          if (message.usage_metadata?.total_tokens) {
            totalTokens = message.usage_metadata?.total_tokens
          }
        }
      }
    },
  }

  const llm = getLanguageModel(textChatRequest.aiModel)
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