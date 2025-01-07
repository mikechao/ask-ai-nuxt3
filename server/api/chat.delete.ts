export default defineEventHandler(async event => {
  const { uid } = getQuery(event)
  console.log('deleting chat history for ', uid)
  if (!uid) {
    console.log('Delete request failed, event missing uid param', JSON.stringify(event))
    throw createError({
      statusCode: 400,
      statusMessage: 'Request is missing uid param'
    })
  }
    const chatHistory = getFirestoreChatMessageHistory(uid.toString())
    chatHistory.clear()
      .catch((error) => {
        console.log('Error clearing chat history', error)
      })
})