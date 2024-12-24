import { BufferMemory } from "langchain/memory";
import { getFirestoreChatMessageHistory } from "../../utils/firestoreChatHistory";
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: runtimeConfig.openaiAPIKey
})

async function getPrompt(imageBase64: string, question: string) {
  if (imageBase64) {
    return ChatPromptTemplate.fromMessages([
      new SystemMessage(`Given the image, you will answer user questions about it.
        You will take into account the current converstation: {chat_history}`),
      new HumanMessage(question),
      new HumanMessage({content: [{type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`} }]}),
    ])
  } else {
    return ChatPromptTemplate.fromMessages([
      new SystemMessage(`You will continue answering user questions taking into account the
        current conversation: {chat_history}`),
      new HumanMessage(question)
    ])
  }
}

function getQuestionPrompt(question: string) {
  return ChatPromptTemplate.fromMessages([
    new SystemMessage(`You will continue answering user questions about the image described after "The image:" 
      given the current conversation: {chat_history}`),
    new HumanMessage(question)
  ])
}

function getImageDescriptionPrompt(imageBase64: string) {
  return ChatPromptTemplate.fromMessages([
    new SystemMessage(`Give the image provided by the user, you will provide a detailed 
      description of the image, include the following aspects:
      -What is the overall scene or setting?
      -Who or what is in the image?
      -What objects, actions or notable features are present?
      -Are there any specific details regarding the environment?
      -What emotions or themes does the image convey?
      Prefix your response with "The image:"`),
      new HumanMessage({content: [{type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`} }]})
  ])
}

async function handleImage(imageBase64: string, memory: BufferMemory) {
  const prompt = getImageDescriptionPrompt(imageBase64)
  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, verbose: false})
  const res = await chain.call({ input: 'Describe the image'})
  console.log('handlImage res', res)
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

  if (imageBase64) {
    await handleImage(imageBase64, memory)
  }
  const prompt = getQuestionPrompt(question)

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, verbose: true})

  const res = await chain.call({ question: question})

  // console.log('res', res)

  return {
    gptResponse: res.response
  }
})