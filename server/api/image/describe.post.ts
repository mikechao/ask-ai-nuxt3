import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getLanguageModel } from "~/server/utils/getLanguageModel";
import { AIModel } from "~/types/enums";

const describeImage =`Give the image provided by the user, you will provide a detailed 
      description of the image, include the following aspects:
      -What is the overall scene or setting?
      -Who or what is in the image?
      -What objects, actions or notable features are present?
      -Are there any specific details regarding the environment?
      -What emotions or themes does the image convey?`

function getImageDescriptionPrompt(imageBase64: string) {
  return ChatPromptTemplate.fromMessages([
    new SystemMessage(describeImage),
    new HumanMessage({content: [{type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`} }]})
  ])
}

function getHumanMessage(imageBase64: string) {
  return new HumanMessage({
    content: [
      { type: 'text', text: describeImage },
      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
    ]
  })
}

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const { imageBase64, aiModel } = body as ImageDescribeRequest
  if (!imageBase64 || imageBase64.length == 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is missing imageBase64'
    })
  }
  console.log('using aiModel', aiModel)
  const llm = getLanguageModel(aiModel)
  if (AIModel.GPT_4o_mini === aiModel) {
    const prompt = getImageDescriptionPrompt(imageBase64)
    const chain = prompt.pipe(llm)
    const res = await chain.invoke({ input: 'Describe the image'})
    const totalTokens = res.usage_metadata?.total_tokens
    
    return { imageDescription: res.content, tokensUsed: totalTokens }
  } else {
    // Gemini PRO
    const message = getHumanMessage(imageBase64)
    const response = await llm.invoke([message])
    // console.log('response', response)
    const totalTokens = response.usage_metadata?.total_tokens
    return { imageDescription: response.content, tokensUsed: totalTokens}
  }
})