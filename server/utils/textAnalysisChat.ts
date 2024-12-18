import { PromptTemplate, } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import admin from "firebase-admin"
import { BufferMemory } from "langchain/memory";
import { FirestoreChatMessageHistory } from "@langchain/community/stores/message/firestore";
import { ConversationChain } from "langchain/chains"
import type { ServiceAccount } from "firebase-admin";

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    apiKey: runtimeConfig.openaiAPIKey
})

const cred = process.env.GOOGLE_APPLICATION_CREDENTIALS as string
const serviceAccountJSON = JSON.parse(cred)

const prompt = PromptTemplate.fromTemplate(`You are a helpful AI. 
  You will answer a question about the following text 
  and any follow up questions the human might have. 
  You will keep responses short as if you are replying
  in an online chat. Do not include AI: in your responses.
  Current conversation: {chat_history} 
  {input}`)

export async function textAnalysis(inputs: string[], uid: string) {
  const chatHistory = new FirestoreChatMessageHistory({
    collections: ["chats"],
    docs: [uid],
    sessionId: 'sid' + uid,
    userId: uid,
    config: {
      projectId: "ask-ai-nuxt3",
      credential: admin.credential.cert(serviceAccountJSON as ServiceAccount),
    },
  })
  
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history"
  });

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, })
  const joined = inputs.join('\n')
  const res = await chain.call({ input: joined })

  return res.response

}