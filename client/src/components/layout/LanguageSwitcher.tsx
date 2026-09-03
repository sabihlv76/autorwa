"use client";

import { IconSelect } from "@/components/ui/IconSelect";
import { useLocale } from "@/components/providers/LocaleProvider";
import { localeLabels, locales, type Locale } from "@/lib/i18n";

const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  rw: "🇷🇼",
  sw: "🇹🇿",
};

export function LanguageSwitcher() {
  const { locale, setLocale, dictionary } = useLocale();

  return (
    <IconSelect
      value={locale}
      onChange={setLocale}
      ariaLabel={dictionary.nav.language}
      options={locales.map((l) => ({
        value: l,
        label: localeLabels[l],
        icon: localeFlags[l],
      }))}
    />
  );
}
