import { createClient } from '@deepgram/sdk'
import formidable from 'formidable'
import { readFile } from 'fs/promises'
import type { IncomingMessage } from 'http'

const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)

function parseFile(req: IncomingMessage) {
  const form = formidable({ multiples: true })
  return new Promise<{ files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) reject(err)
      resolve({ files })
    })
  })
}

export default defineEventHandler(async event => {
  let audioFiles = null
  try {
    const { files } = await parseFile(event.node.req)
    audioFiles = files
  } catch (error) {
    return { error: error}
  }

  if (!audioFiles || !audioFiles.file) {
    return { error: new Error('No file was uploaded')}
  }

  const audioFile = audioFiles.file[0]
  const audioBuffer = await readFile(audioFile.filepath)

  try {
    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        punctuate: true
      }
    )
    // console.log('dgResponse\n', JSON.stringify(dgResponse))
    const transcript = dgResponse.result?.results?.channels[0]?.alternatives[0]?.transcript
    const confidence = dgResponse.result?.results?.channels[0]?.alternatives[0]?.confidence
    const error = dgResponse.error
    return { transcript: transcript, confidence: confidence, error: error }
  } catch (error) {
    return { errror: error }
  }
})