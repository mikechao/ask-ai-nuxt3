import type { FileSource } from '@deepgram/sdk'
import { createClient } from '@deepgram/sdk'
import multer from 'multer'
import type { H3Event, EventHandlerRequest } from 'h3'

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

async function parseWithMulter(event: H3Event<EventHandlerRequest>) {
  console.log('parseWithMulter called')
  try {
    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage}).single('file')
    await new Promise((resolve, reject) => {
      upload(event.node.req, event.node.res, (err) => {
        if (err) {
          console.log('multer error', err)
          reject(err)
        }
        resolve()
      })
    })
    const file = event.node.req.file
    console.log('parseWithMulter finished')
    return file.buffer
  } catch (error) {
    console.log('error parsing event.node.req', error)
    throw new Error('Error parsing with multer', error)
  }
}

async function parseForNetlify(event) {
  console.log('parseForNetlify called')
  const eventBody = await readBody(event)
  console.log('eventBody', Object.prototype.toString.call(eventBody))
  const result = Buffer.from(eventBody, 'base64')
  console.log('result === null', result === null)
  console.log('result', Object.prototype.toString.call(result))
  return result
}

export default defineEventHandler(async event => {
  console.log('transcribe post called')
  let audioFile = null
  if (!event.node.req?.body) {
    audioFile = await parseWithMulter(event)
  } else {
    audioFile = await parseForNetlify(event)
  }
  const results = await callDeepgram(audioFile.buffer)
  return results
})