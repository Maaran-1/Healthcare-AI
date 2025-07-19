const chatContainer = document.getElementById("chat-container");

function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.textContent = text;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message bot typing-indicator";
  typingDiv.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  typingDiv.id = "typing-indicator";
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();

  if (!userText) return;

  appendMessage(userText, "user");
  input.value = "";
  input.focus();

  appendTypingIndicator();

  try {
    const reply = await getAIResponse(userText);
    removeTypingIndicator();
    appendMessage(reply, "bot");
  } catch (err) {
    removeTypingIndicator();
    appendMessage("Sorry, I couldn't connect to the AI service.", "bot");
  }
}

// Call your backend API instead of OpenAI directly!
async function getAIResponse(userText) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: userText })
  });
  const data = await response.json();
  return data.reply;
}

document.getElementById("user-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});