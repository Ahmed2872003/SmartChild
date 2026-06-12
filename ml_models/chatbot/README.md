---
title: SmartChild Chatbot API
emoji: 🧸
colorFrom: blue
colorTo: green
sdk: docker
app_port: 5001
---
# SmartChild Chatbot Backend

A lightweight, blazing-fast FastAPI microservice for the SmartChild conversational AI. It loads a locally fine-tuned Qwen2.5-1.5B model equipped with a custom LoRA adapter.

---

## 🚀 Quick Setup

### 1. Model Weights
Place your extracted fine-tuned files (e.g., `adapter_config.json`, `adapter_model.safetensors`, `.gguf`) directly into the `model/weights/` folder.

### 2. Install Dependencies
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # Mac/Linux

# Install requirements
pip install -r requirements.txt
```

### 3. Run the Server
```bash
uvicorn main:app --host 0.0.0.0 --port 5001 --reload
```
Server starts at: `http://localhost:5001`

---

## ⚡ API Endpoints

The API is strictly optimized into 2 primary endpoints that automatically handle storytelling and feelings analysis based on contextual intelligence.

### `POST /chat/child`
Handles direct conversation with the child and automatically tells stories if asked.
**Supports Streaming:** Add `?stream=true` to the URL for word-by-word Server-Sent Events (SSE).

**Request:**
```json
{
  "childName": "Ahmed",
  "age": 8,
  "message": "I finished all my games today! Tell me a story!",
  "history": []
}
```

**Response:**
```json
{
  "reply": "Wow Ahmed, you are a superstar! Once upon a time...",
  "mode": "child"
}
```

---

### `POST /chat/parent`
Acts as an advisor for parents and automatically analyzes the child's mood based on the injected `child_history`.
**Supports Streaming:** Add `?stream=true` to the URL.

**Request:**
```json
{
  "childName": "Ahmed",
  "age": 8,
  "message": "How is Ahmed doing overall?",
  "report": "Overall growth: 12% | Emotional state: happy",
  "history": [],
  "child_history": [
    { "role": "user", "content": "I finished all my games today!" }
  ]
}
```

**Response:**
```json
{
  "reply": "Based on his recent chats, Ahmed is highly engaged and feeling very proud of his achievements...",
  "mode": "parent"
}
```
*(Note: The `history` array stores the parent's ongoing conversation with the Advisor, while the `child_history` array is used purely for the Advisor to analyze what the child recently said to Sunny.)*

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` to configure:

| Variable | Default | Description |
|----------|---------|-------------|
| `MODEL_PATH` | `./model/weights` | Path to the local LoRA adapter files |
| `BASE_MODEL` | `Qwen/Qwen2.5-1.5B-Instruct` | The base model ID |
| `MAX_NEW_TOKENS` | `150` | Maximum length of generated replies |
| `TEMPERATURE` | `0.7` | AI creativity (0.0 = robotic, 1.0 = creative) |
| `USE_4BIT` | `true` | Memory saving for GPU |
| `PORT` | `5001` | The FastAPI server port |

---

## 🏥 Diagnostics
- **`GET /health`** - Check API uptime status.
- **`GET /model/info`** - Verify if your LoRA adapter successfully attached to the base model.
  