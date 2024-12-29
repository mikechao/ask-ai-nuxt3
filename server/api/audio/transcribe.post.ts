import { createClient } from '@deepgram/sdk'
import formidable from 'formidable'
import { readFile } from 'fs/promises'
import type { IncomingMessage } from 'http'

const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)

function parseFile(req: IncomingMessage) {
  console.log('parseFile called')
  const form = formidable({ multiples: true })
  console.log('form created ', form !== null)
  return new Promise<{ files: formidable.Files }>((resolve, reject) => {
    console.log('inside promise before parse')
    form.parse(req, (err, _fields, files) => {
      console.log('inside parse callback', err, _fields, files)
      if (err) {
        console.log('err', err)
        reject(err)
      }
      console.log('before resovle files', files)
      resolve({ files })
    })
  })
}

export default defineEventHandler(async event => {
  console.log('transcribe post called')
  let audioFiles = null
  try {
    const { files } = await parseFile(event.node.req)
    audioFiles = files
    console.log('parsed audioFiles')
  } catch (error) {
    console.log('error parsing event.node.req', error)
    return { error: error}
  }

  if (!audioFiles || !audioFiles.file) {
    return { error: new Error('No file was uploaded')}
  }

  console.log('start read file')
  const audioFile = audioFiles.file[0]
  const audioBuffer = await readFile(audioFile.filepath)
  console.log('end read file')

  try {
    console.log('Start deepgram call')
    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
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
    return { transcript: transcript, confidence: confidence, error: error }
  } catch (error) {
    return { errror: error }
  }
})