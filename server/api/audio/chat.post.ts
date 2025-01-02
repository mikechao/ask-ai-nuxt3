import { textAnalysis } from "../../utils/textAnalysisChat"
import { PromptTemplate } from "@langchain/core/prompts"

const template = `You are a helpful AI assiatant.
You will answer questions about the following text that has been transcribed from an audio file.
You will keep responses short as if you are replying
in an online chat. Do not include "AI:" in your responses.
You will respond as if you are {aiChatMode}
The transcribed text is under "Transcript to analyze"
The human question is under "Question to answer".
Current conversation: {chat_history}
{input}
`

const prompt = new PromptTemplate({
  inputVariables: ["input", "aiChatMode", "chat_history"],
  template: template
})

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const token = getCookie(event, 'token') as string

  const textChatRequest = body as TextChatRequest

  const input = textChatRequest.messages

  if (input === null) {
      throw createError({
          statusCode: 400,
          statusMessage: 'Request body is missing messages'
      })
  }

  const response = await textAnalysis(textChatRequest, token, prompt)
  return response
})