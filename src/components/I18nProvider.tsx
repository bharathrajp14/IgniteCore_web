"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { I18N_COOKIE_KEY, isLanguageCode, LanguageCode, TranslationKey, translate } from "@/lib/i18n";

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (value: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const I18N_STORAGE_KEY = "ignitecore-language";

const I18nContext = createContext<I18nContextValue | null>(null);

function getBrowserLanguageFallback() {
  if (typeof navigator === "undefined") {
    return "en" as LanguageCode;
  }

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ta")) return "ta" as LanguageCode;
  if (browserLanguage.startsWith("hi")) return "hi" as LanguageCode;
  if (browserLanguage.startsWith("te")) return "te" as LanguageCode;
  if (browserLanguage.startsWith("ml")) return "ml" as LanguageCode;
  if (browserLanguage.startsWith("kn")) return "kn" as LanguageCode;
  if (browserLanguage.startsWith("ar")) return "ar" as LanguageCode;
  if (browserLanguage.startsWith("fr")) return "fr" as LanguageCode;
  if (browserLanguage.startsWith("de")) return "de" as LanguageCode;
  if (browserLanguage.startsWith("es")) return "es" as LanguageCode;
  return "en" as LanguageCode;
}

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "en" as LanguageCode;
  }

  const cookieValue = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${I18N_COOKIE_KEY}=`))
    ?.split("=")[1];

  if (isLanguageCode(cookieValue)) {
    return cookieValue;
  }

  const stored = window.localStorage.getItem(I18N_STORAGE_KEY) as LanguageCode | null;
  if (isLanguageCode(stored)) {
    return stored;
  }

  return getBrowserLanguageFallback();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  const setLanguage = (value: LanguageCode) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(I18N_STORAGE_KEY, value);
      document.cookie = `${I18N_COOKIE_KEY}=${value}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = value;
    }

    setLanguageState(value);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translate(language, key),
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
