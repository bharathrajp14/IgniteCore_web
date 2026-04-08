"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/siteContent";
import { trackEvent } from "@/lib/tracking";

export function WhatsAppFloat() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleChatState = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>;
      setChatOpen(Boolean(customEvent.detail?.open));
    };

    window.addEventListener("ignitecore:chat-state", handleChatState as EventListener);
    return () => {
      window.removeEventListener("ignitecore:chat-state", handleChatState as EventListener);
    };
  }, []);

  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackEvent("cta_click", { location: "floating_whatsapp", cta: "whatsapp_chat" })}
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-[max(1rem,calc((100vw-1100px)/2+1rem))] z-50 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-teal)] px-4 text-sm font-semibold text-white shadow-lg ring-2 ring-white transition-all duration-200 ${
        chatOpen ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
      }`}
    >
      <span>WA</span>
      <span className="hidden md:inline">Chat now</span>
    </a>
  );
}
