"use client";

import { useMemo, useState } from "react";
import { LANGUAGES } from "@/lib/i18n";
import { useI18n } from "@/components/I18nProvider";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { language, setLanguage, t } = useI18n();

  const activeLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  const filteredLanguages = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return LANGUAGES;

    return LANGUAGES.filter((item) => {
      return item.name.toLowerCase().includes(normalized) || item.nativeName.toLowerCase().includes(normalized);
    });
  }, [search]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-deep-navy)]"
        aria-expanded={open}
        aria-label={t("language.label")}
      >
        {activeLanguage.nativeName}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-[var(--color-border)] bg-white p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-slate)]">{t("language.label")}</p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("language.searchPlaceholder")}
            className="mb-2 h-10 w-full rounded-md border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-orange)]"
          />

          <div className="max-h-56 space-y-1 overflow-y-auto">
            {filteredLanguages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  if (item.code === language) {
                    setOpen(false);
                    setSearch("");
                    return;
                  }

                  setLanguage(item.code);
                  setOpen(false);
                  setSearch("");
                  window.location.reload();
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  item.code === language
                    ? "bg-[var(--color-cream)] font-semibold text-[var(--color-deep-navy)]"
                    : "text-[var(--color-slate)] hover:bg-[var(--color-cream)]"
                }`}
              >
                {item.nativeName}
                <span className="ml-1 text-xs text-[var(--color-slate)]">({item.name})</span>
              </button>
            ))}

            {filteredLanguages.length === 0 ? (
              <p className="px-2 py-4 text-sm text-[var(--color-slate)]">{t("language.noResults")}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
