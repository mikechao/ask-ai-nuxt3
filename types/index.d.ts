import type { AIModel } from "./enums"

export { TextChatResposne }

declare global {

  interface TextChatRequest {
    messages: string[],
    aiChatMode: AIChatMode,
    aiModel: AIModel
  }

  interface TextChatResposne {
    /** The text response from the LLM */
    gptResponse: string,

    /** The number of tokens used so far */
    tokensUsed: number
  }

  interface AudioTranscribeResposne {

    /** The transcribe text from the audio file */
    transcript: string | undefined,

    /** The level of confidence the model has in the transcript */
    confidence: number | undefined,

    /** If there were any error that occured during audio transcribing */
    error: Error | null
  }

  interface ImageChatRequest {

    imageDescription: string,

    question: string,

    aiChatMode: AIChatMode,

    aiModel: AIModel
  }

  interface ImageDescribeRequest {
    imageBase64: string,
    aiModel: AIModel
  }

  interface ImageDescribeResponse {
    imageDescription: string,
    tokensUsed: number
  }

}