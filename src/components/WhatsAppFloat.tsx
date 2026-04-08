"use client";

import { BRAND } from "@/lib/siteContent";
import { trackEvent } from "@/lib/tracking";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackEvent("cta_click", { location: "floating_whatsapp", cta: "whatsapp_chat" })}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] right-[max(1rem,calc((100vw-1100px)/2+1rem))] z-50 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-teal)] px-4 text-sm font-semibold text-white shadow-lg ring-2 ring-white"
    >
      <span>WA</span>
      <span className="hidden md:inline">Chat now</span>
    </a>
  );
}
