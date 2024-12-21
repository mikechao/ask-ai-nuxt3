import { createClient } from '@deepgram/sdk'
const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)

export default defineEventHandler(async event => {
  const body = await readBody(event)
  console.log('body', body)

  return 'I am suppose to transcribe audio for you'
})