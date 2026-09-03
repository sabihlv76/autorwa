"use client";

import { Flag, type FlagCode } from "@/components/ui/Flag";
import { IconSelect } from "@/components/ui/IconSelect";
import { useLocale } from "@/components/providers/LocaleProvider";
import { localeLabels, locales, type Locale } from "@/lib/i18n";

const localeFlags: Record<Locale, FlagCode> = {
  en: "GB",
  fr: "FR",
  rw: "RW",
  sw: "TZ",
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
        icon: <Flag code={localeFlags[l]} />,
      }))}
    />
  );
}
