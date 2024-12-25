import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: runtimeConfig.openaiAPIKey
})

function getImageDescriptionPrompt(imageBase64: string) {
  return ChatPromptTemplate.fromMessages([
    new SystemMessage(`Give the image provided by the user, you will provide a detailed 
      description of the image, include the following aspects:
      -What is the overall scene or setting?
      -Who or what is in the image?
      -What objects, actions or notable features are present?
      -Are there any specific details regarding the environment?
      -What emotions or themes does the image convey?`),
      new HumanMessage({content: [{type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`} }]})
  ])
}

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const { imageBase64 } = body as ImageDescribeRequest
  if (!imageBase64 || imageBase64.length == 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is missing imageBase64'
    })
  }

  const prompt = getImageDescriptionPrompt(imageBase64)
  const chain = prompt.pipe(llm)
  const res = await chain.invoke({ input: 'Describe the image'})
  // const totalTokens = res.usage_metadata?.total_tokens
  // console.log('describe res', res)
  return res.content
})