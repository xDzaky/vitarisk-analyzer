import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { RotateCcw, SendHorizonal, Sparkles, X } from "lucide-react";

import { apiRequest } from "../lib/api";

const STORAGE_KEY = "vitarisk_chatbot_widget_state";
const DEFAULT_MESSAGES = [
  {
    role: "bot",
    text: "Halo, saya asisten VitaRisk. Kamu bisa tanya soal hasil cek, arti risiko, atau informasi kesehatan dasar.",
    suggestions: [
      "Apa arti hasil prediksi saya?",
      "Kapan saya perlu ke dokter?",
      "Kebiasaan apa yang perlu dibenahi dulu?",
    ],
  },
];

function readStoredState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatBotText(text = "") {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function resizeTextarea(element) {
  if (!element) return;

  element.style.height = "0px";
  element.style.height = `${Math.min(element.scrollHeight, 96)}px`;
}

export default function ChatbotWidget() {
  const location = useLocation();
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const storedState = useMemo(() => readStoredState(), []);

  const [isOpen, setIsOpen] = useState(storedState?.isOpen || false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(
    Array.isArray(storedState?.messages) && storedState.messages.length > 0
      ? storedState.messages
      : DEFAULT_MESSAGES
  );
  const [clarificationState, setClarificationState] = useState(
    storedState?.clarificationState || null
  );
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isOpen,
        messages,
        clarificationState,
      })
    );
  }, [isOpen, messages, clarificationState]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      window.setTimeout(() => inputRef.current?.focus(), 120);
    };

    window.addEventListener("vitarisk:open-chatbot", handleOpen);
    return () =>
      window.removeEventListener("vitarisk:open-chatbot", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    resizeTextarea(inputRef.current);
  }, [chatInput, isOpen]);

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const handleSendChat = async () => {
    const messageToSend = chatInput.trim();
    if (!messageToSend || loading) return;

    const userMessage = { role: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);
    setChatError("");

    try {
      const result = await apiRequest("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          context: {
            current_page: location.pathname,
            ...(clarificationState
              ? { clarification_state: clarificationState }
              : {}),
          },
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            result?.data?.answer ||
            "Maaf, saya belum bisa menjawab pertanyaan itu sekarang.",
          suggestions: result?.data?.suggestions || [],
        },
      ]);

      setClarificationState(result?.data?.clarification?.state || null);
    } catch (error) {
      setChatError(error.message || "Chatbot sedang tidak bisa diakses.");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Maaf, chatbot sedang mengalami kendala. Coba lagi sebentar ya.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(DEFAULT_MESSAGES);
    setClarificationState(null);
    setChatError("");
    setChatInput("");
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-5 right-5 z-[100] w-[calc(100vw-2rem)] max-w-[23rem] overflow-hidden rounded-[30px] border border-[#d8e8dd] bg-white shadow-[0_22px_70px_rgba(41,95,78,0.24)] flex flex-col" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#295f4e] via-[#377965] to-[#5ca28d] px-5 pb-4 pt-5 text-white">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-8 h-20 w-20 rounded-full bg-[#b9d9cb]/15 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/16 ring-1 ring-white/15">
                  <img
                    src="/icons.svg"
                    alt="VitaRisk"
                    className="h-7 w-auto brightness-0 invert"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold tracking-[0.01em]">
                      VitaRisk Assistant
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/12 hover:text-white"
                  aria-label="Mulai chat baru"
                >
                  <RotateCcw size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/12 hover:text-white"
                  aria-label="Tutup chatbot"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,#f7fbf8_0%,#eff6f1_100%)] flex flex-col min-h-0 flex-1">
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: '15rem', maxHeight: '25rem' }}>
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#295f4e] text-white shadow-[0_10px_24px_rgba(41,95,78,0.18)]"
                        : "rounded-bl-md border border-[#dcebe0] bg-white text-[#295f4e]"
                    }`}
                  >
                    {message.role === "bot" ? (
                      <div className="space-y-2">
                        {formatBotText(message.text).map((paragraph) => (
                          <p
                            key={paragraph}
                            className="whitespace-pre-wrap break-words"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    )}

                    {message.role === "bot" &&
                    Array.isArray(message.suggestions) &&
                    message.suggestions.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2 pt-1">
                        {message.suggestions.slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="rounded-full border border-[#d9e7dd] bg-[#f4faf6] px-3 py-1.5 text-xs text-[#295f4e] transition hover:bg-[#dcebe0]"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-[24px] rounded-bl-md border border-[#dcebe0] bg-white px-4 py-3 text-sm text-[#295f4e] shadow-sm">
                    Sedang menyiapkan jawaban...
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[#e2eee6] bg-white px-4 pb-4 pt-3 shrink-0">
              {chatError ? (
                <p className="mb-3 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-600">
                  {chatError}
                </p>
              ) : null}

              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={chatInput}
                  onChange={(event) => {
                    setChatInput(event.target.value);
                    resizeTextarea(event.target);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSendChat();
                    }
                  }}
                  placeholder="Ketik pertanyaanmu di sini..."
                  disabled={loading}
                  className="min-h-[42px] max-h-[96px] flex-1 resize-none overflow-y-auto rounded-[20px] border border-[#cfe1d4] bg-[#f7fbf8] px-4 py-[10px] text-sm leading-5 text-gray-800 outline-none transition focus:border-[#295f4e] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleSendChat}
                  disabled={loading || !chatInput.trim()}
                  className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-[#295f4e] to-[#3d816c] text-white transition hover:from-[#234f40] hover:to-[#326a59] disabled:cursor-not-allowed disabled:from-[#a5c1b4] disabled:to-[#a5c1b4]"
                  aria-label="Kirim pesan"
                >
                  <SendHorizonal size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-full bg-gradient-to-r from-[#295f4e] to-[#3c7f6b] px-4 py-3.5 text-white shadow-[0_18px_50px_rgba(41,95,78,0.28)] transition hover:from-[#234f40] hover:to-[#2f6656]"
        aria-label="Buka chatbot VitaRisk"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/15">
          <img
            src="/icons.svg"
            alt=""
            className="h-7 w-auto brightness-0 invert"
          />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight">
            Chat VitaRisk
          </span>
          <span className="block text-xs text-white/80">
            Tanya hasil cekmu di sini
          </span>
        </span>
      </button>
    </>
  );
}
