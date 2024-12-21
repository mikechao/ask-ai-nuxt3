export { TextChatResposne }

declare global {

  interface TextChatResposne {
    /** The text response from the LLM */
    gptResponse: string
  }
}