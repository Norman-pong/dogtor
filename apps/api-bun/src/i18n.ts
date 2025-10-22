import en from "@dogtor/shared-i18n/locales/en.json" assert { type: "json" };
import zhCN from "@dogtor/shared-i18n/locales/zh-CN.json" assert { type: "json" };

export type Locale = "en" | "zh-CN";

const translations = {
  en,
  "zh-CN": zhCN,
} as const;

function getByPath(obj: any, path: string): string | undefined {
  return path
    .split(".")
    .reduce<any>(
      (acc, cur) => (acc && acc[cur] != null ? acc[cur] : undefined),
      obj,
    );
}

export function tWithLocale(locale: Locale, key: string): string {
  const fromLocale = getByPath(translations[locale], key);
  if (typeof fromLocale === "string") return fromLocale;
  const fallback = getByPath(translations.en, key);
  return typeof fallback === "string" ? fallback : key;
}

export function detectLocale(acceptLanguage?: string | null): Locale {
  const header = acceptLanguage?.toLowerCase() ?? "";
  if (
    header.includes("zh-cn") ||
    header.startsWith("zh") ||
    header.includes("zh")
  ) {
    return "zh-CN";
  }
  return "en";
}

export function createServerI18n(locale: Locale) {
  return {
    locale,
    t: (key: string) => tWithLocale(locale, key),
  };
}
