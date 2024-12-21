import { PromptTemplate, } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains"
import { getFirestoreChatMessageHistory } from "./firestoreChatHistory";

const runtimeConfig = useRuntimeConfig()



const prompt = PromptTemplate.fromTemplate(`You are a helpful AI. 
  You will answer questions about the text under Text to analyze. 
  You will also answer follow up questions the human might have.
  The human question is under Question to answer.
  You will keep responses short as if you are replying
  in an online chat. Do not include AI: in your responses.
  Current conversation: {chat_history} 
  {input}`)

export async function textAnalysis(inputs: string[], uid: string): Promise<TextChatResposne> {
  const chatHistory = getFirestoreChatMessageHistory(uid)
  
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history"
  });

  let totalTokens = 0
  const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    apiKey: runtimeConfig.openaiAPIKey,
    callbacks: [
      {
        handleLLMEnd(output) {
          // console.log(JSON.stringify(output, null, 2))
          // tokenUsage.totalTokens is specific to the model gpt-4o-mini
          totalTokens = output.llmOutput?.tokenUsage.totalTokens
        },
      },
    ],
  })

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, })
  const joined = inputs.join('\n')
  const res = await chain.call({ input: joined })

  return new Promise<TextChatResposne>((resolve) => {
    resolve({
      gptResponse: res.response,
      tokensUsed: totalTokens
    })
  })

}