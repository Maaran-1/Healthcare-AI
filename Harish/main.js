const apiKey = "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";

async function callOpenAI(question) {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: question }],
    temperature: 0.7
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error) {
      return `❌ Error: ${data.error.message}`;
    }

    const reply = data.choices?.[0]?.message?.content;
    return (reply || "⚠️ Couldn't generate a valid response.") + "\n\n⚠️ This is not a prescription.";
  } catch (err) {
    console.error("Fetch failed:", err);
    return "⚠️ Failed to connect to AI service.";
  }
}

async function handleSubmit() {
  const queryInput = document.getElementById("query");
  const responseBox = document.getElementById("response");
  const chatLog = document.getElementById("chat-log");
  const text = queryInput.value.trim();
  if (!text) return;

  chatLog.innerHTML += `<div class="message user"> ${text}</div>`;
  queryInput.value = "";
  responseBox.textContent = "🤖 Typing...";

  const reply = await callOpenAI(text);

  chatLog.innerHTML += `<div class="message bot">🤖 ${reply}</div>`;
  responseBox.textContent = reply;
  chatLog.scrollTop = chatLog.scrollHeight;
}

function handleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("query").value = transcript;
    await handleSubmit();
  };
  recognition.start();
}
