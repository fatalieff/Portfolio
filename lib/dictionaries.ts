import type { Locale } from "./i18n-config";
import az from "@/messages/az.json";
import en from "@/messages/en.json";
import ru from "@/messages/ru.json";

const dictionaries = { az, en, ru } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
