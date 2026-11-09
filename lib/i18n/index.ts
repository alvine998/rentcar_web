import { defaultLocale, hasLocale, type Locale } from "./config";
import { en, type Dictionary } from "./en";
import { id } from "./id";
import { zh } from "./zh";

export const dictionaries: Record<Locale, Dictionary> = { id, en, zh };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[hasLocale(locale) ? locale : defaultLocale];
}

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

export type { Dictionary };
export * from "./config";
