import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { AIModel } from "~/types/enums";

const runtimeConfig = useRuntimeConfig()

const gpt4oMini = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: runtimeConfig.openaiAPIKey,
})

const geminiPro = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro',
  temperature: 0,
  apiKey: runtimeConfig.googleAPIKey,
})

export function getLanguageModel(aiModel: AIModel) {
  if (AIModel.GPT_4o_mini === aiModel) {
    return gpt4oMini
  }
  return geminiPro
}