import {
  ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

// Set the Bedrock Agent Model ID
export const BEDROCK_AGENT_MODEL_ID = "WLCUYDRNTK:0EYP4E1MKI";

// Define the Bedrock Agent invocation function
export const bedrockAgentInvokeFunction = defineFunction({
  entry: "./bedrock-agent-invoke.ts",
  environment: {
    BEDROCK_AGENT_MODEL_ID,
  },
});

// Define the GraphQL schema
const schema = a.schema({
  invokeAgent: a
    .query()
    .arguments({ question: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(bedrockAgentInvokeFunction)),
});

// Export the schema and data configuration
export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
