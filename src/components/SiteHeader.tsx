"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/siteContent";
import { trackEvent } from "@/lib/tracking";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/I18nProvider";

const NAV_LINKS = [
  { href: "/", key: "nav.home" as const },
  { href: "/about", key: "nav.about" as const },
  { href: "/services", key: "nav.services" as const },
  { href: "/courses", key: "nav.courses" as const },
  { href: "/results", key: "nav.caseStudies" as const },
  { href: "/portfolio", key: "nav.portfolio" as const },
  { href: "/contact", key: "nav.contact" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-cream)]/96 backdrop-blur">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-dark)] text-[11px] text-white">
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-2 px-4 py-2 md:px-6">
          <p className="font-mono tracking-[0.16em] text-slate-300">IGNITECORE SOLUTIONS</p>
          <div className="flex items-center gap-4 text-slate-200">
            <a href={`tel:${BRAND.phone}`} className="hover:text-white">+91 {BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`} className="hover:text-white">{BRAND.email}</a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-deep-navy)]" aria-label={BRAND.company}>
          <img src="/brand/mark.svg" alt="IgniteCore mark" className="h-10 w-10 sm:h-11 sm:w-11" />
          <span className="leading-none">
            <span className="block font-display text-3xl italic sm:text-[34px]">
              <span className="text-[var(--color-orange)]">Ignite</span>
              <span className="text-[var(--color-deep-navy)]">Core</span>
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-teal)] sm:text-[11px]">
              Solutions
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[var(--color-slate)] transition hover:text-[var(--color-deep-navy)]">
              {t(item.key)}
            </Link>
          ))}
          <LanguageSwitcher />
          <a
            href={BRAND.bookingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("cta_click", { location: "header", cta: "free_ai_audit" })}
            className="rounded-md bg-[var(--color-orange)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-ember)]"
          >
            {t("cta.freeAudit")}
          </a>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-content-center rounded-md border border-[var(--color-border)] md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="space-y-1">
            <span className={`block h-0.5 w-5 bg-[var(--color-deep-navy)] transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--color-deep-navy)] transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--color-deep-navy)] transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-cream)] transition-[max-height] duration-300 md:hidden ${open ? "max-h-96" : "max-h-0"}`}
      >
        <nav className="mx-auto flex w-full max-w-[1100px] flex-col gap-2 px-4 py-3" aria-label="Mobile navigation">
          <div className="mb-2 flex justify-end">
            <LanguageSwitcher />
          </div>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-[15px] font-medium text-[var(--color-deep-navy)] hover:bg-white"
            >
              {t(item.key)}
            </Link>
          ))}
          <a
            href={BRAND.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 rounded-md bg-[var(--color-orange)] px-4 py-3 text-center text-sm font-semibold text-white"
            onClick={() => {
              trackEvent("cta_click", { location: "mobile_menu", cta: "free_ai_audit" });
              setOpen(false);
            }}
          >
            {t("cta.freeAudit")}
          </a>
        </nav>
      </div>
    </header>
  );
}
