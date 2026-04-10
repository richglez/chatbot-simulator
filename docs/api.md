# API Reference

Base URL: `http://localhost:8000`

---

## POST /chat

Sends a message to the chatbot and returns a response.

**Request body:**
```json
{
  "text": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "I'm doing well, how about you?"
}
```

**Notes:**
- The backend keeps conversation history in memory.
- Each request builds on the previous context of the session.

---

## DELETE /chat

Resets the conversation history.

**Request body:** none

**Response:**
```json
{
  "status": "conversación reiniciada"
}
```

**Notes:**
- Use this endpoint when the user clicks "New chat" in the UI.
- After calling this, the next POST /chat starts a fresh conversation.
