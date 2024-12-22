import { textAnalysis } from "../utils/textAnalysisChat"
import { PromptTemplate, } from "@langchain/core/prompts"

const prompt = PromptTemplate.fromTemplate(`You are a helpful AI. 
  You will answer questions about the text under Text to analyze. 
  You will also answer follow up questions the human might have.
  The human question is under Question to answer.
  You will keep responses short as if you are replying
  in an online chat. Do not include "AI:" in your responses.
  Current conversation: {chat_history} 
  {input}`)

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const token = getCookie(event, 'token') as string

    const input = body.messages

    if (input === null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request body is missing messages'
        })
    }
    const response = await textAnalysis(input, token, prompt)
    return response
})