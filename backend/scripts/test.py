import torch # <--- Importante para manejar los tensores del historial
from transformers import AutoModelForCausalLM, AutoTokenizer
from dataclasses import dataclass

@dataclass
class Message:
  text: str


tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")

# 1. Funcion de codificar a token
def text_tokenizer(message: Message):
    input_ids = tokenizer.encode(
          message.text + tokenizer.eos_token,
          return_tensors="pt"
      )
    return input_ids


print("--- Chatbot Iniciado (escribe 'salir' para terminar) ---")
# Variable para guardar la memoria de la conversación
chat_history_ids = None




while True:
  user_prompt = input("Tu: ")

  if user_prompt.lower() in ["salir", "exit", "quit"]:
    break

  # 2. Intanciar un nuevo mensaje
  newMessage = Message(text=user_prompt)
  # 3. Convertir el mensaje a token
  newTokenizer = text_tokenizer(newMessage)


  print(f"\nTu mensaje: '{newMessage.text}' se convirtio en el tensor: {newTokenizer}")

  # 4. MEMORIA: Concatenar el historial con el nuevo mensaje
  if chat_history_ids is not None:
     bot_input_ids = torch.cat([chat_history_ids, newTokenizer], dim=-1)
  else:
     bot_input_ids = newTokenizer

  # 5. Generar la respuesta del modelo con generate
  chat_history_ids = model.generate(
    bot_input_ids,
    max_length=1000,
    do_sample=True,
    top_k=50,
    top_p=0.95,
    temperature=0.75,
    pad_token_id=tokenizer.eos_token_id
  )

  # 5. Decodificar (convertir la respuesta de vuelta a palabras)
  respuesta = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)

  print(f"\nBot: {respuesta}")



