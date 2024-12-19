export default defineEventHandler(async event => {
  const token = getCookie(event, 'token') as string
  if (!token) {
    console.log('Delete request failed, event missing cookie', JSON.stringify(event))
    throw createError({
      statusCode: 400,
      statusMessage: 'Request is missing cookie'
    })
  }
    const chatHistory = getFirestoreChatMessageHistory(token)
    chatHistory.clear()
})