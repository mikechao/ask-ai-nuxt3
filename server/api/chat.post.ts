import { chatOpenAIFirebase } from "../utils/chatOpenAIFirebase"

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
    // console.log('input', input)
    const response = {
        gptResponse: await chatOpenAIFirebase(input, token)
    }
    return response
})