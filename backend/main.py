from fastapi import FastAPI # Framework web para crear la API del backend
from fastapi.middleware.cors import CORSMiddleware # Middleware para manejar CORS y permitir que React se comunique con el backend
from pydantic import BaseModel # Validador de datos para definir el esquema del mensaje entrante en la API
from transformers import AutoModelForCausalLM, AutoTokenizer # Para cargar el modelo de lenguaje y su tokenizer, en este caso DialoGPT de Microsoft
import torch # Para manejar tensores y operaciones relacionadas con el modelo de lenguaje

app = FastAPI() # Crear una instancia de la aplicación FastAPI

# CORS para que React pueda hablar con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Permitir solo el origen de desarrollo de React
    allow_methods=["*"], # Permitir todos los métodos HTTP (GET, POST, DELETE, etc.)
    allow_headers=["*"], # Permitir todos los encabezados HTTP (Content-Type, Authorization, etc.)
)

# Cargar modelo y tokenizer al iniciar el servidor
print("Cargando modelo... esto puede tardar un momento.")
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")
print("Modelo listo.")

# Historial de conversación (en memoria)
chat_history_ids = None

# Contrato de datos validado con pydantic
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

    # Generar respuesta del modelo
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
