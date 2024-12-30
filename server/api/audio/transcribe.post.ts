import type { FileSource } from '@deepgram/sdk'
import { createClient } from '@deepgram/sdk'
import multer from 'multer'
import type { H3Event, EventHandlerRequest } from 'h3'
import busboy from "busboy"

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
  console.log('event?.body', event?.body)
  console.log('event.node.req.body', event.node.req.body)
  console.log('using Reponse')
  const response = new Response(event.node.req.body)
  console.log('resposne.text')
  const text = await response.text()
  console.log('Passing text into Buffer.from')
  const uint8Array = Buffer.from(text, 'base64')

  const req = event.node.req
  const result = await new Promise((resolve) => {
    // we'll store all form fields inside of this
    const fields = {};
    const files = {};

    // let's instantiate our busboy instance!
    const bb = busboy({
      headers: req.headers,
    });

    // before parsing anything, we need to set up some handlers.
    // whenever busboy comes across a file ...
    bb.on("file", async (name, fileStream, info) => {
      const { filename, encoding, mimeType } = info;

      files[name] = {
        originalFilename: Buffer.from(filename, "latin1").toString("utf8"),
        encoding: encoding,
        mimetype: mimeType,
        content: await buffer(fileStream),
      };
    });

    // whenever busboy comes across a normal field ...
    bb.on("field", (fieldName, value) => {
      // ... we write its value into `fields`.
      fields[fieldName] = value;
    });

    // once busboy is finished, we resolve the promise with the resulted fields.
    bb.on("finish", () => {
      resolve([fields, files]);
    });

    bb.write(uint8Array)
  })
  console.log('result', result)
  return uint8Array
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