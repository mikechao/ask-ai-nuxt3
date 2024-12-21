import { textAnalysis } from "../utils/textAnalysisChat"

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
    const response = await textAnalysis(input, token)
    return response
})