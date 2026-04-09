import { useState } from "react";

export default function App() {
  // Esqueleto de mensajes
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);

  // Estados
  const [promptInput, setPromptInput] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Estado para controlar el estado focus del input

  // Funcion de mandar mensaje
  const sendMessage = async () => {
    // 1. Validacion de datos
    if (!prompt.trim()) {
      console.log("[INPUT], Campos vacios o invalidos.");
    }

    // Crear mensaje del usuario
    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => {
      [...prev, userMessage];
    });
    setPromptInput("");
  };

  // Funcion de mandar el mensaje si se presiona un Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    // Main Container
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      {/* Chat Wrapper */}
      <div className="flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {/* Input Division */}
        <div className="border-t border-neutral-800 px-4 py-4">
          {/* Contenedor del Borde Animado */}
          <div
            className={`rounded-xl p-0.5 transition-all duration-500 ${
              isFocused
                ? "animate-none bg-neutral-700"
                : "animate-neon bg-linear-to-r from-green-400 via-purple-500 to-green-400"
            } `}
          >
            {/* Input Wrapper */}
            <div className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2.5">
              <input
                className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
                value={promptInput}
                type="text"
                placeholder="Ask anything.."
                name="promptInput"
                id=""
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              handleKeyDown
              <button
                onClick={sendMessage}
                disabled={!promptInput.trim()}
                className="cursor-pointer text-emerald-400 transition-colors hover:text-emerald-300 disabled:cursor-default disabled:text-neutral-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
