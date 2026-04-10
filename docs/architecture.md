# Architecture

## Overview

This project is divided into two independent layers: a React frontend and a Python backend. The frontend sends messages to the backend via HTTP, and the backend processes them through the DialoGPT model and returns a response.

---

## Project Structure

```
chatbot-simulator/
├── frontend/        # React + Vite + Tailwind CSS
├── backend/         # Python + FastAPI + DialoGPT
├── docs/            # Project documentation
├── .gitignore
└── README.md
```

---

## Data Flow
```
User types a message
↓
React (frontend) sends POST /chat
↓
FastAPI (backend) receives the message
↓
DialoGPT generates a response
↓
FastAPI returns the response as JSON
↓
React displays the response in the chat
```

---

## Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Frontend | React + Vite + Tailwind CSS          |
| Backend  | Python + FastAPI + Uvicorn           |
| AI Model | Hugging Face Transformers + DialoGPT |

---

## Ports

| Service  | Port |
| -------- | ---- |
| Frontend | 5173 |
| Backend  | 8000 |

---
