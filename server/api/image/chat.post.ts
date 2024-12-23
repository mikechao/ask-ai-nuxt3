import { BufferMemory } from "langchain/memory";
import { getFirestoreChatMessageHistory } from "../../utils/firestoreChatHistory";
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains"

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const token = getCookie(event, 'token') as string

  const { imageBase64, question} = body as ImageChatRequest

  const chatHistory = getFirestoreChatMessageHistory(token)
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history"
  });

  const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    apiKey: runtimeConfig.openaiAPIKey
  })

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Describe the image provided"],
    [
      "user",
      [{ type: "image_url", image_url: "data:image/jpeg;base64,{base64}" }],
    ],
  ])
  
  const chain = prompt.pipe(llm)
  const res = await chain.invoke({ base64: imageBase64 })

  console.log('res', res)

  return {
    gptResponse: res.content
  }
})