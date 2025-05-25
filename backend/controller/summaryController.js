const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const Todo = require("../models/Todo");
require("dotenv").config();

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

exports.summarizeTodos = async (req, res) => {
  try {
    const userId = req.user._id;
    const todos = await Todo.find({ userId, completed: false }).sort({
      createdAt: -1,
    });

    if (todos.length === 0) {
      return res
        .status(200)
        .json({ message: "No pending todos to summarize." });
    }

    const todoText = todos
      .map(
        (todo, i) =>
          `${i + 1}. Title: ${todo.title}\n   Description: ${
            todo.description || "No description"
          }\n   Deadline: ${
            todo.deadline ? new Date(todo.deadline).toLocaleDateString() : "N/A"
          }`
      )
      .join("\n\n");

    const prompt = `Summarize the following to-do list clearly in 2-3 lines with crispy answer and one emoji:\n\n${todoText}`;

    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1024,
    };

    const command = new InvokeModelCommand({
      modelId:
        "arn:aws:bedrock:us-east-1:859958574074:inference-profile/us.anthropic.claude-sonnet-4-20250514-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody),
    });

    const response = await bedrockClient.send(command);
    const jsonResponse = JSON.parse(new TextDecoder().decode(response.body));
    const summary =
      jsonResponse.content?.[0]?.text?.trim() ||
      "✅ You have some pending tasks, but I couldn't summarize them right now.";

    const slackMessage = {
      text: `📝 *Todo Summary*\n\n*Tasks Overview:*\n${summary}\n\n*Total Incomplete Tasks:* ${todos.length}`,
    };

    const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage),
    });

    if (!slackResponse.ok) {
      throw new Error(`Slack webhook failed: ${slackResponse.statusText}`);
    }

    return res.status(200).json({
      message: "All tasks summarized and posted to Slack.",
      summary,
    });
  } catch (err) {
    console.error("❌ Error in /summarize:", err);
    return res.status(500).json({
      message: "Error summarizing tasks.",
      error: err.message,
    });
  }
};
