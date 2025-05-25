// services/claudeClient.js
const {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: "us-east-1", // Region where your profile is located
});

async function getClaudeSummary(promptText) {
  const body = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [
      {
        role: "user",
        content: promptText,
      },
    ],
    max_tokens: 1000,
  };

  const command = new InvokeModelWithResponseStreamCommand({
    modelId:
      "arn:aws:bedrock:us-east-1:859958574074:inference-profile/us.anthropic.claude-sonnet-4-20250514-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });

  const response = await client.send(command);

  // Decode streaming response
  const decoder = new TextDecoder("utf-8");
  let fullResponse = "";
  for await (const chunk of response.body) {
    const decoded = decoder.decode(chunk.chunk?.bytes, { stream: true });
    fullResponse += decoded;
  }

  // Claude returns streamed JSON objects per chunk, so we must parse
  const match = fullResponse.match(/"text":"(.*?)"/s);
  const text = match ? match[1].replace(/\\n/g, "\n") : "No summary generated.";

  return text;
}

module.exports = { getClaudeSummary };
