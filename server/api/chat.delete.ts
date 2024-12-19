export default defineEventHandler(async event => {
  const token = getCookie(event, 'token') as string
  console.log('deleting chat memory for ' + token)
})