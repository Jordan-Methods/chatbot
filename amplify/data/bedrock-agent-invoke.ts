import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";

// AWS configuration
const region = process.env.AWS_REGION || "eu-west-2";

export async function handler(event: { question: string }) {
  const { question } = event;

  const client = new BedrockAgentRuntimeClient({
    region: region,
    requestHandler: new NodeHttpHandler(),
  });

  const input = {
    inputText: question,
    agentId: process.env.BEDROCK_AGENT_MODEL_ID!.split(":")[0],
    agentAliasId: process.env.BEDROCK_AGENT_MODEL_ID!.split(":")[1],
    sessionId: "default-session",
    enableTrace: false,
  };

  try {
    const command = new InvokeAgentCommand(input);
    const response = await client.send(command);

    // Process the response
    const decoder = new TextDecoder("utf-8");
    let fullResponse = "";

    // If response is a stream, concatenate chunks
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk) {
          fullResponse += decoder.decode(chunk.chunk.bytes);
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Error invoking agent:", error);
    throw error;
  }
}
