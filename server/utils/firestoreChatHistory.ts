import { FirestoreChatMessageHistory } from "@langchain/community/stores/message/firestore";
import type { ServiceAccount } from "firebase-admin";
import admin from "firebase-admin"

const cred = process.env.GOOGLE_APPLICATION_CREDENTIALS as string
const serviceAccountJSON = JSON.parse(cred)
const collections = ["chats"]

export function getFirestoreChatMessageHistory(uid: string) {
  return new FirestoreChatMessageHistory({
      collections: collections,
      docs: [uid],
      sessionId: 'sid' + uid,
      userId: uid,
      config: {
        projectId: "ask-ai-nuxt3",
        credential: admin.credential.cert(serviceAccountJSON as ServiceAccount),
      },
  })
}