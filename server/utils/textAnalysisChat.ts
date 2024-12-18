import { PromptTemplate, } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import admin from "firebase-admin"
import { BufferMemory } from "langchain/memory";
import { FirestoreChatMessageHistory } from "@langchain/community/stores/message/firestore";
import { ConversationChain } from "langchain/chains"

const runtimeConfig = useRuntimeConfig()

const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    apiKey: runtimeConfig.openaiAPIKey
})


const prompt = PromptTemplate.fromTemplate(`You are a helpful AI. 
  You will answer a question about the following text 
  and any follow up questions the human might have. 
  You will keep responses short as if you are replying
  in an online chat. Do not include AI: in your responses.
  Current conversation: {chat_history} 
  {input}`)

export async function textAnalysis(inputs: string[], uid: string) {
  const chatHistory = new FirestoreChatMessageHistory({
    collections: ["chats"],
    docs: [uid],
    sessionId: 'sid' + uid,
    userId: uid,
    config: {
      projectId: "ask-ai-nuxt3",
      credential: admin.credential.cert({
        projectId: "ask-ai-nuxt3",
        privateKey:
          "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5s18FiHgtlC1y\n595h20oIHLgcSQndfmh7ccCs0T6rin7rZqmxZbhiyd24/+xt3s+Rs5Gu3drNsjiQ\ncg2U3hRKGo8IRfIJph2K8TFefFhIoDpv4kU47YcbEKxivkujGyJ+/ptTM36sEru5\nREfrmCdnu7vQPxuL2QEY9/q1djH6JrhTJYb+A+Jq3xzj19qPIlqECyOQctm/kSTu\n1hVMnFli5weEvxFPbpJ8WxTw38ms681zHvkGlJ+JIv6SVwkNzMYQjZvvXDz59DuU\n1rQruiCQT5AxNOwFwtUtC0DpG5Yj42OeVhM8NmrMItLTgXifs/GxnK9QRmiIYABX\nuhLWByZlAgMBAAECggEACgKYBu+UENrpt0W1+F7uhvDrYMT0Je8sOSlI2lf+MZeJ\n320djR0/Wv3oOJJ9H3ARDtjX6830Pz3R7EFlp4ZwIA1989N3aFs+wPBe+amoxaNz\nevf+xMKTE5uquzjoUV7DVYaqf0nplGN/II3EdbfyOdaGGYPpW3jDZSHq7xCzwXjw\nnfAXFEYiFkF2u5BFJbAbQP4W+qqMhR8Zc1lpKId4MQHqLDflStUiEGHSNJzC4ljW\n2WSM1y25RKkgmNaTP53bwPDKgoTKvw37/12qLw9v2pbn0IEO3euQzzpNkvQqnWCM\neEMjKwYYZynSDnRsqWh9umoTRIx05qNJPqErKK2t0QKBgQD685fFNHGNPx/lfGzh\n3Aprc2t2iW5EHIjqZGkAeopOeVD7fXeO9jML8e7dDSzQqgP1t0IbAU2EryzktjZZ\nieTWb8U1AGtTAJp+YEsLJNCU+J7I/6rGVkQXVbLA4CkkiRbQMTAar/ViuMGs5Rru\nNAbPX5RTjQgbZcN6AWi7efcVsQKBgQC9b7wPjU0/YplfXcejgIyNUiSrQGhyFJyv\nifJvIloqU9284yHvdskTLPg2xWSjdXTPChPjKsqvywXl1SiYmjxLYg+xYvi4kGxE\npx5l2pwDoOk3joVtoGQcuw7j6LgRg2GTGIm0ov0ny+m6dtEgws3cMxF1K7QGJiqw\n6pZFRcqk9QKBgQDUZFRgcJlmbTWmuZ9BrUUYWhBqu7gaZ3gtwRvpbs0dy6mRoEgP\nNCpSAsoiRqNWW36MeTS2vGyKTuSVEe5/66hFIUXsLNWo40reiMsavGbYnm9tOI2l\n3Z81jK+EdHP92xT20ZqgC6qIikxI84LOdjQJUSCtciCZZ5CA8y5b9cb8kQKBgCYs\n2TItII8QeKX+SRgK9MgZ8KfOL/4lZzn8y61Xt+Hlyr6g6xrNzlGd81teRhyms+Zx\nOnbCDdyFRmf9n9O46UOrvEvcDRFskVT4dKjD+ELG75ixkPP5qZMcozCMmmN1HXm+\nLSoI2ollj3FzNkuq1j90zyTUrM+8a0gBzkyhduftAoGBAO+y095kd51XcrXOqqgi\n5/ZqNJ95bDyo0pvm9d9k549743eXmFlj2fUBHADzqNMgt5VXZkKKLmCe6YNoAir0\nzKv/GlGt02+9C/Q+6cva9wITnfSBrZITjZjN9b5XdBvaNnOrB2+4On3/8XwfKboy\nkIzaUWoLe5CnOqdo4waP6PQU\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-upgu0@ask-ai-nuxt3.iam.gserviceaccount.com",
      }),
    },
  })
  
  const memory = new BufferMemory({
      chatHistory: chatHistory,
      memoryKey: "chat_history"
  });

  const chain = new ConversationChain({ llm: llm, prompt: prompt, memory: memory, })
  const joined = inputs.join('\n')
  const res = await chain.call({ input: joined })

  return res.response

}