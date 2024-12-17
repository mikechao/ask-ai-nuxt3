import { chatOpenAI } from "../utils/chatOpenAI"

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const token = getCookie(event, 'token')
    console.log('token', token)
    const input = body.messages
    if (input === null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request body is missing messages'
        })
    }
    // console.log('input', input)
    const response = {
        gptResponse: await chatOpenAI(input)
    }
    return response
})