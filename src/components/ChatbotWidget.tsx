"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/tracking";
import { useI18n } from "@/components/I18nProvider";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatbotWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const starterQuestions = useMemo(
    () => [t("chat.quick.services"), t("chat.quick.start"), t("chat.quick.bundle")],
    [t]
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: t("chat.greeting"),
    },
  ]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.role === "assistant") {
        return [{ role: "assistant", content: t("chat.greeting") }];
      }

      return prev;
    });
  }, [t]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ignitecore:chat-state", { detail: { open } }));
    }
  }, [open]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...(sessionId ? { sessionId } : {}),
          messages: nextMessages.slice(-12),
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        const userFriendlyError =
          errorData.error && errorData.error.toLowerCase().includes("origin")
            ? t("chat.error.generic")
            : errorData.error || t("chat.error.generic");

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: userFriendlyError,
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
          content: data.reply || "Thanks for sharing. If you give me your business type and current challenge, I can guide the best next step.",
        },
      ]);
    } catch (error) {
      const content =
        error instanceof Error && error.name === "AbortError"
          ? "Chat is taking longer than expected. Please try again in a few seconds."
          : t("chat.error.network");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content,
        },
      ]);
    } finally {
      window.clearTimeout(timeoutId);
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
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] right-[max(1rem,calc((100vw-1100px)/2+1rem))] z-50">
      {open ? (
        <section className="mb-3 flex h-[70vh] w-[min(360px,92vw)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-dark)] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">{t("chat.title")}</p>
              <p className="text-xs text-slate-300">{t("chat.subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
            >
              {t("chat.close")}
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
                {t("chat.thinking")}
              </div>
            ) : null}
          </div>

          <div className="border-t border-[var(--color-border)] bg-white p-3">
            <p className="mb-2 text-xs text-[var(--color-slate)]">{t("chat.limitNotice")}</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {starterQuestions.map((question) => (
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
                placeholder={t("chat.placeholder")}
                className="h-10 flex-1 rounded-md border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-orange)]"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-10 rounded-md bg-[var(--color-orange)] px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {t("chat.send")}
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
        aria-label={`${t("chat.open")} ${t("chat.title")}`}
      >
        Q&A
      </button>
    </div>
  );
}
