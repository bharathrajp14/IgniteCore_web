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
      className="fixed bottom-6 right-4 z-50 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-teal)] px-4 text-sm font-semibold text-white shadow-lg ring-2 ring-white"
    >
      <span>WA</span>
      <span className="hidden md:inline">Chat now</span>
    </a>
  );
}
