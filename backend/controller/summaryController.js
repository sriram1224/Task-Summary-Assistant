const axios = require("axios");
const Todo = require("../models/Todo");

const apiKeys = [
  process.env.OPENROUTER_API_KEY1,
  process.env.OPENROUTER_API_KEY2,
  process.env.OPENROUTER_API_KEY3,
].filter(Boolean);

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

    const prompt = `Summarize the following to-do list clearly in 2-3 lines with a short overview and one emoji:\n\n${todoText}`;
    const messages = [{ role: "user", content: prompt }];

    let summary = null;
    for (const key of apiKeys) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "google/gemini-2.0-flash-exp:free",
            messages,
          },
          {
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://task-summary-assistant.onrender.com",
            },
          }
        );

        summary = response.data.choices[0].message.content;
        break;
      } catch (err) {
        console.error(`❌ LLM failed with key ${key.slice(-4)}:`, err.message);
      }
    }

    if (!summary) {
      return res
        .status(429)
        .json({ message: "All LLM API keys failed or quota exceeded." });
    }

    const slackMessage = `📝 *Todo Summary*\n\n*Tasks Overview:*\n${summary}\n\n*Total Incomplete Tasks:* ${todos.length}`;

    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: slackMessage,
    });

    return res.status(200).json({
      message: "All tasks summarized and posted to Slack.",
      summary,
    });
  } catch (err) {
    console.error("❌ Error in /summarize:", err.message);
    return res.status(500).json({
      message: "Error summarizing tasks.",
      error: err.message,
    });
  }
};
