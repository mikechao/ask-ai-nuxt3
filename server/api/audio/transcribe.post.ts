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
  const results = await new Promise((resolve) => {
    // we'll store all form fields inside of this
    const fields = {};

    // let's instantiate our busboy instance!
    const bb = busboy({
      // it uses request headers
      // to extract the form boundary value (the ----WebKitFormBoundary thing)
      headers: event.headers
    });

    // before parsing anything, we need to set up some handlers.
    // whenever busboy comes across a file ...
    bb.on(
      "file",
      (fieldname, filestream, filename, transferEncoding, mimeType) => {
        // ... we take a look at the file's data ...
        filestream.on("data", (data) => {
          // ... and write the file's name, type and content into `fields`.
          fields[fieldname] = {
            filename,
            type: mimeType,
            content: data,
          };
        });
      }
    );

    // whenever busboy comes across a normal field ...
    bb.on("field", (fieldName, value) => {
      // ... we write its value into `fields`.
      fields[fieldName] = value;
    });

    // once busboy is finished, we resolve the promise with the resulted fields.
    bb.on("finish", () => {
      resolve(fields)
    });

    // now that all handlers are set up, we can finally start processing our request!
    bb.write(event.body);
  });
  console.log('results', results)
  console.log('results.file', results.file)
  return results.file.content
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