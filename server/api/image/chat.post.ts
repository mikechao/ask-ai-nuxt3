import { BufferMemory } from "langchain/memory";
import { getFirestoreChatMessageHistory } from "../../utils/firestoreChatHistory";
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate, HumanMessagePromptTemplate, ImagePromptTemplate, PipelinePromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const runtimeConfig = useRuntimeConfig()

async function getPrompt(imageBase64: string, question: string) {
  if (imageBase64) {
    return ChatPromptTemplate.fromMessages([
      new SystemMessage(`Given the image, you will answer user questions about it.
        You will take into account the current converstation: {chat_history}`),
      new HumanMessage(question),
      new HumanMessage([{image_url: `data:image/jpeg;base64,${imageBase64}`}])
    ])
  } else {
    return ChatPromptTemplate.fromMessages([
      new SystemMessage(`You will continue answering user questions taking into account the
        current conversation: {chat_history}`),
      new HumanMessage(question)
    ])
  }
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const token = getCookie(event, 'token') as string

  const { imageBase64, question } = body as ImageChatRequest

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

  const prompt = await getPrompt(imageBase64 as string, question)

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, verbose: true})

  const res = await chain.call({ question: question})

  console.log('res', res)

  return {
    gptResponse: res.response
  }
})