const API_KEY = "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"; // Replace if you revoke this key

async function callAI(question) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000" // Change this if deploying
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // You can change model if needed
        messages: [
          { role: "system", content: "You are a helpful healthcare assistant chatbot. Avoid giving prescriptions." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "⚠️ Sorry, I couldn't generate a response.";
    return reply + "\n\n⚠️ This is not a prescription.";
  } catch (error) {
    console.error("API error:", error);
    return "⚠️ Error connecting to OpenRouter API.";
  }
}

function appendMessage(sender, text) {
  const chatLog = document.getElementById("chat-log");

  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = `<span class="icon">${sender === "user" ? "🧑‍💻" : "🤖"}</span>
                   <span class="text">${text}</span>`;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function handleSubmit() {
  const input = document.getElementById("query");
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";

  const reply = await callAI(text);
  appendMessage("bot", reply);
}

function handleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support speech input.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.onresult = async (e) => {
    const transcript = e.results[0][0].transcript;
    document.getElementById("query").value = transcript;
    await handleSubmit();
  };
  recognition.start();
}

document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("query");
  inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });
});
