"use client";

import { FormEvent, useMemo, useState } from "react";
import { trackEvent } from "@/lib/tracking";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_QUESTIONS = [
  "What services do you provide?",
  "How do I start a project?",
  "Can you help with automation and website together?",
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I am IgniteCore Assistant. I can help with services, project scope, pricing direction, and next steps.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: nextMessages.slice(-12),
        }),
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I could not process that right now. Please try again or use the Contact page.",
          },
        ]);
        return;
      }

      const data = (await response.json()) as { reply?: string; sessionId?: string };
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Thanks. Please share more details and I will help.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network issue. Please retry in a moment or use the Contact page.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;

    trackEvent("chat_submit", { location: "chatbot_widget" });
    await sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <section className="mb-3 flex h-[70vh] w-[min(360px,92vw)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-dark)] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">IgniteCore Assistant</p>
              <p className="text-xs text-slate-300">Instant answers for services and next steps</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
            >
              Close
            </button>
          </header>

          <div className="chat-scroll flex-1 space-y-3 overflow-y-auto bg-[var(--color-cream)] p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "assistant"
                    ? "bg-white text-[var(--color-deep-navy)]"
                    : "ml-auto bg-[var(--color-orange)] text-white"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isSending ? (
              <div className="max-w-[88%] rounded-xl bg-white px-3 py-2 text-sm text-[var(--color-slate)]">
                Thinking...
              </div>
            ) : null}
          </div>

          <div className="border-t border-[var(--color-border)] bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => {
                    trackEvent("chat_quick_prompt", { prompt: question });
                    void sendMessage(question);
                  }}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-deep-navy)] hover:bg-[var(--color-cream)]"
                >
                  {question}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                className="h-10 flex-1 rounded-md border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-orange)]"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-10 rounded-md bg-[var(--color-orange)] px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          trackEvent("chat_toggle", { open: nextOpen });
        }}
        className="grid h-12 w-12 place-content-center rounded-full bg-[var(--color-deep-navy)] text-sm font-semibold text-white shadow-xl ring-2 ring-white"
        aria-label="Open chat assistant"
      >
        AI
      </button>
    </div>
  );
}
