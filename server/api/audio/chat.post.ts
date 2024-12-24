import { textAnalysis } from "../../utils/textAnalysisChat"
import { PromptTemplate } from "@langchain/core/prompts"

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const token = getCookie(event, 'token') as string

  const input = body.messages

  const prompt = PromptTemplate.fromTemplate(`You are a helpful AI assiatant.
    You will answer questions about the following text that has been transcribed from an audio file.
    You will keep responses short as if you are replying
    in an online chat. Do not include "AI:" in your responses.
    The transcribed text is under "Transcript to analyze"
    The human question is under "Question to answer".
    Current conversation: {chat_history}
    {input}
    `)

  if (input === null) {
      throw createError({
          statusCode: 400,
          statusMessage: 'Request body is missing messages'
      })
  }
  const response = await textAnalysis(input, token, prompt)
  return response
})