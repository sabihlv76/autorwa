"use client";

import { Flag, type FlagCode } from "@/components/ui/Flag";
import { IconSelect } from "@/components/ui/IconSelect";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { currencies } from "@/lib/currency";
import type { Currency } from "@/types/product";

const currencyFlags: Record<Currency, FlagCode> = {
  USD: "US",
  RWF: "RW",
};

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const { dictionary } = useLocale();

  return (
    <IconSelect
      value={currency}
      onChange={setCurrency}
      ariaLabel={dictionary.nav.currency}
      options={currencies.map((c) => ({
        value: c,
        label: c,
        icon: <Flag code={currencyFlags[c]} />,
      }))}
    />
  );
}
