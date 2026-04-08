import { cookies, headers } from "next/headers";
import { I18N_COOKIE_KEY, LanguageCode, isLanguageCode } from "@/lib/i18n";

export async function getServerLanguage(): Promise<LanguageCode> {
  const headerStore = await headers();
  const rawCookieHeader = headerStore.get("cookie") || "";
  const cookieMatch = rawCookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${I18N_COOKIE_KEY}=`));

  const fromHeader = cookieMatch?.split("=")[1];
  if (isLanguageCode(fromHeader)) {
    return fromHeader;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(I18N_COOKIE_KEY)?.value;

  if (isLanguageCode(value)) {
    return value;
  }

  return "en";
}
