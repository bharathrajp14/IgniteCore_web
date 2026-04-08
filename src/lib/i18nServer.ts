import { cookies } from "next/headers";
import { I18N_COOKIE_KEY, LanguageCode, isLanguageCode } from "@/lib/i18n";

export async function getServerLanguage(): Promise<LanguageCode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(I18N_COOKIE_KEY)?.value;

  if (isLanguageCode(value)) {
    return value;
  }

  return "en";
}
