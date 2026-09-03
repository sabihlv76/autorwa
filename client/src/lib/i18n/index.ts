import en, { type Dictionary } from "./dictionaries/en";
import fr from "./dictionaries/fr";
import rw from "./dictionaries/rw";
import sw from "./dictionaries/sw";

export type Locale = "en" | "fr" | "rw" | "sw";

export const locales: Locale[] = ["en", "fr", "rw", "sw"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  rw: "Kinyarwanda",
  sw: "Kiswahili",
};

export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, fr, rw, sw };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
