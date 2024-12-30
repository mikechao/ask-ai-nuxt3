import { createClient } from '@deepgram/sdk'
import busboy from 'busboy'
import { buffer } from "node:stream/consumers"

const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)


async function parseMultipartForm(req) {
  console.log('parseMultipartForm called')
  return new Promise((resolve) => {
    const fields = {}
    const files = {}

    const bb = busboy({
      headers: req.headers,
    })

    bb.on("file", async (name, fileStream, info) => {
      const { filename, encoding, mimeType } = info

      files[name] = {
        originalFilename: Buffer.from(filename, "latin1").toString("utf8"),
        encoding: encoding,
        mimetype: mimeType,
        content: await buffer(fileStream),
      }
    })

    bb.on("field", (fieldName, value) => {
      fields[fieldName] = value;
    })

    bb.on("finish", () => {
      resolve([fields, files]);
    })

    console.log('req.pipe(bb)')
    req.pipe(bb);

  })
}


export default defineEventHandler(async event => {
  console.log('transcribe post called')

  let audioFiles = null
  try {
    const parseResult = await parseMultipartForm(event.node.req)
    const files = parseResult[1]
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
  const audioFile = audioFiles['file']
  // const audioBuffer = await readFile(audioFile.filepath)
  console.log('end read file')

  try {
    console.log('Start deepgram call')
    const dgResponse = await deepgram.listen.prerecorded.transcribeFile(
      audioFile.content,
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
    console.log('deepgram error', error)
    return { errror: error }
  }
})