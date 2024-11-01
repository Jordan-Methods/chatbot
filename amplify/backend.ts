import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, AGENT_ID, generateHaikuFunction } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
  generateHaikuFunction,
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "bedrock:InvokeAgent"
    ],
    resources: [
      `arn:aws:bedrock:eu-west-2:412381744271:agent/WLCUYDRNTK` // Specific agent resource
    ],
  })
);
