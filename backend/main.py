from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# CORS para que React pueda hablar con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo y tokenizer al iniciar el servidor
print("Cargando modelo... esto puede tardar un momento.")
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")
print("Modelo listo.")

# Historial de conversación (en memoria)
chat_history_ids = None

# Esquema del mensaje entrante
class Message(BaseModel):
    text: str

@app.post("/chat")
def chat(message: Message):
    global chat_history_ids

    # Tokenizar el mensaje del usuario
    input_ids = tokenizer.encode(
        message.text + tokenizer.eos_token,
        return_tensors="pt"
    )

    # Concatenar con el historial
    bot_input_ids = torch.cat(
        [chat_history_ids, input_ids], dim=-1
    ) if chat_history_ids is not None else input_ids

    # Generar respuesta
    chat_history_ids = model.generate(
        bot_input_ids,
        max_length=1000,
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=3,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.75,
    )

    # Decodificar solo la respuesta nueva
    response = tokenizer.decode(
        chat_history_ids[:, bot_input_ids.shape[-1]:][0],
        skip_special_tokens=True
    )

    return {"response": response}

@app.delete("/chat")
def reset_chat():
    global chat_history_ids
    chat_history_ids = None
    return {"status": "conversación reiniciada"}
