import { createClient } from '@deepgram/sdk'
import busboy from 'busboy'
import { buffer } from "node:stream/consumers"

const runtimeConfig = useRuntimeConfig()
const deepgram = createClient(runtimeConfig.deepgramAPIKey)

const streamToBuffer = (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    readableStream.on('data', (chunk) => {
      chunks.push(chunk); // Collect data chunks
    });
    
    readableStream.on('end', () => {
      const buffer = Buffer.concat(chunks); // Combine all chunks into a single Buffer
      resolve(buffer); // Return the complete buffer
    });
    
    readableStream.on('error', (err) => {
      reject(err); // Handle any errors
    });
  });
};

async function parseMultipartForm(req) {
  console.log('parseMultipartForm called')
  let bodyBuffer = null
  if (req?.body) {
    console.log('req?body is true')
    bodyBuffer = await streamToBuffer(req.body)
  }
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

    if (req?.body) {
      console.log('req?.body is true')
      console.log('bodyBuffer === null', bodyBuffer === null)
      bb.end(bodyBuffer);
    } else {
      console.log('in else req.pipe(bb)')
      req.pipe(bb);
    }
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