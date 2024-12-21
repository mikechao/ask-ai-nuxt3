export { TextChatResposne }

declare global {

  interface TextChatResposne {
    /** The text response from the LLM */
    gptResponse: string,

    /** The number of tokens used so far */
    tokensUsed: number
  }
}