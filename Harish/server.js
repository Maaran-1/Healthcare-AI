// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3001;

const apiKey = "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"; // Use env in production

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "mistralai/mistral-7b-instruct", // or llama2, gemma, etc.
        messages: [
          {
            role: "system",
            content:
              "You are a helpful and responsible healthcare assistant. Avoid medical prescriptions. Offer health awareness advice only.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // or your deployed frontend URL
        },
      }
    );

    const aiReply =
      response.data?.choices?.[0]?.message?.content ||
      "⚠️ I couldn't understand your message.";
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenRouter API error:", error.message);
    res
      .status(500)
      .json({ reply: "⚠️ Error talking to AI. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ OpenRouter backend running at http://localhost:${PORT}`);
});
