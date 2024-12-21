import { PromptTemplate, } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains"
import { getFirestoreChatMessageHistory } from "./firestoreChatHistory";

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    apiKey: runtimeConfig.openaiAPIKey
})

const prompt = PromptTemplate.fromTemplate(`You are a helpful AI. 
  You will answer a question about the following text 
  and any follow up questions the human might have. 
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

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, })
  const joined = inputs.join('\n')
  const res = await chain.call({ input: joined })

  return new Promise<TextChatResposne>((resolve) => {
    resolve({gptResponse: res.response})
  })

}