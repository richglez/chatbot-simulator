import { useState, useRef, useEffect } from "react";

export default function App() {
  // Esqueleto de mensajes
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);

  // Estados
  const [promptInput, setPromptInput] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Estado para controlar el estado focus del input
  const [isTyping, setIsTyping] = useState(false);

  // Referencias
  const bottomRef = useRef(null);

  // Efecto de renderizado
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Funcion de mandar mensaje
  const sendMessage = async () => {
    // 1. Validacion de datos
    if (!promptInput.trim() || isTyping) {
      console.log("[INPUT], Campos vacios o invalidos.");
      return;
    }

    // Crear mensaje del usuario
    const userMessage = { role: "user", text: promptInput };
    setMessages((prev) => [...prev, userMessage]);
    setPromptInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promptInput }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
    } catch (error) {
      console.log(`[ERROR], Se ha producido un error: ${error}`);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to the server." },
      ]);
    } finally {
      setIsTyping(false); // el bot ya termino de tipiar
    }
  };

  // Funcion de mandar el mensaje si se presiona un Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Funcion para resetar el chat
  const resetChat = async () => {
    await fetch("http://localhost:8000/chat", {
      method: "DELETE",
    });
    setMessages([{ role: "bot", text: "Hi! How can I help you today?" }]);
  };

  return (
    // Main Container
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      {/* Chat Wrapper */}
      <div className="flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          {/* Wrapper Dot Online */}
          <div className="flex items-center gap-3">
            {/* Dot Online */}
            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
            <span className="text-sm font-medium text-white">Chatbot</span>
          </div>
          {/* New Chat Btn */}
          <button
            onClick={resetChat}
            className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          >
            New chat
          </button>
        </div>
        {/* Message Container*/}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-white text-neutral-900"
                    : "rounded-bl-sm bg-neutral-800 text-neutral-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            // Typing Wrapper
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-neutral-800 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
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
              <button
                onClick={sendMessage}
                disabled={!promptInput.trim() || isTyping}
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
          <p className="mt-2 text-center text-xs text-neutral-600">
            Press Enter to send.{" "}
            <span>
              The chatbot may make mistakes. Please verify the responses.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
