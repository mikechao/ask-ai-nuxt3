import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
  } from "@langchain/langgraph"
import { v4 as uuidv4 } from "uuid";
import type { Messages } from "@langchain/langgraph"


const runtimeConfig = useRuntimeConfig()

const prompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        'You will answer a question about the following text'
    ],
    new MessagesPlaceholder("messages")
])

const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
    apiKey: runtimeConfig.openaiAPIKey
})

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
    const chain = prompt.pipe(llm);
    const response = await chain.invoke(state);
    // Update message history with response:
    return { messages: [response] };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver()
const app = workflow.compile({ checkpointer: memory })
const config = { configurable: { thread_id: uuidv4() } };

export async function chatOpenAI(inputs: Messages) {
    console.log('inputs', inputs)
    const output = await app.invoke({ messages: inputs}, config)
    const lastReponse = output.messages[output.messages.length - 1]
    console.log('************End************')
    return lastReponse.content
}