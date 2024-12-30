import type { FileSource } from '@deepgram/sdk'
import { createClient } from '@deepgram/sdk'

const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)

async function callDeepgram(file: FileSource) {
  try {
    console.log('Start deepgram call')
    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
      file,
      {
        model: 'nova-2',
        punctuate: true
      }
    )
    console.log('End deepgram call')
    // console.log('dgResponse\n', JSON.stringify(dgResponse))
    const transcript = dgResponse.result?.results?.channels[0]?.alternatives[0]?.transcript
    const confidence = dgResponse.result?.results?.channels[0]?.alternatives[0]?.confidence
    const error = dgResponse.error
    if (error) {
      console.log('deepgram error', error)
    }
    return { transcript: transcript, confidence: confidence, error: error }
  } catch (error) {
    console.log('deepgram error', error)
    return { errror: error }
  }
}

export default defineEventHandler(async event => {
  console.log('transcribe post called')
  const body = await readBody(event)

  const { fileBase64 } = body
  if (!fileBase64 || fileBase64.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is missing fileBase64'
    })
  }

  const audioFile = Buffer.from(fileBase64, 'base64')

  const results = await callDeepgram(audioFile)
  return results
})