import { createClient } from '@deepgram/sdk'
import formidable from 'formidable'
import { readFile } from 'fs/promises'
const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)

export default defineEventHandler(async event => {
  const form = formidable({ multiples: true })

  const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ files })
    })
  })

  const audioFile = files.file[0]
  const audioBuffer = await readFile(audioFile.filepath)

  try {
    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        punctuate: true
      }
    )
    //console.log('dgResponse\n', JSON.stringify(dgResponse))
    const transcript = dgResponse.result?.results?.channels[0]?.alternatives[0]?.transcript
    const confidence = dgResponse.result?.results?.channels[0]?.alternatives[0]?.confidence
    const error = dgResponse.error
    return { transcript: transcript, confidence: confidence, error: error }
  } catch (error) {
    return { errror: error}
  }

  return "Should not get here fix later"
})