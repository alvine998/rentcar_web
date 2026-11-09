export const locales = ["id", "en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
  zh: "中文",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return segment && hasLocale(segment) ? segment : null;
}
