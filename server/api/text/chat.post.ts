import { textAnalysis } from "../../utils/textAnalysisChat"
import { PromptTemplate, } from "@langchain/core/prompts"

const template = `You are a helpful AI. 
  You will answer questions about the text under Text to analyze. 
  You will also answer follow up questions the human might have.
  The human question is under Question to answer.
  You will respond as if you are {aiChatMode}
  You will keep responses short as if you are replying
  in an online chat. Do not include "AI:" in your responses.
  Current conversation: {chat_history} 
  {input}`

const prompt = new PromptTemplate({
    inputVariables: ["input", "aiChatMode", "chat_history"],
    template: template
})

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const token = getCookie(event, 'token') as string

    const textChatRequest = body as TextChatRequest

    const input = textChatRequest.messages
    const aiChatModeEnum = textChatRequest.aiChatMode
    const aiChatModeString: string = aiChatModeEnum

    if (input === null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request body is missing messages'
        })
    }
    const response = await textAnalysis(input, token, prompt, aiChatModeString)
    return response
})