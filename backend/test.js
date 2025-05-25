// test-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = "AIzaSyA15pk5b1gJLsNAJE-xeOI8z_GcccqrShc"; // Replace with your actual Gemini API key

(async () => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro-latest",
    });
    const prompt = `Summarize the following tasks in 2-3 lines and include one emoji:\n\n1. Finish portfolio website\n2. Submit assignment\n3. Plan weekend trip`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("✅ Gemini Response:\n", text);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
