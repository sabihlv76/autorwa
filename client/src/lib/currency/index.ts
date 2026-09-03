import type { Currency } from "@/types/product";

export const currencies: Currency[] = ["RWF", "USD"];

// Placeholder fixed rate pending a configurable/trusted exchange-rate source.
// Expressed as "1 USD = N RWF".
export const USD_TO_RWF_RATE = 1450;

export function convert(
  amount: number,
  from: Currency,
  to: Currency,
): number {
  if (from === to) return amount;
  if (from === "USD" && to === "RWF") return amount * USD_TO_RWF_RATE;
  if (from === "RWF" && to === "USD") return amount / USD_TO_RWF_RATE;
  return amount;
}

export function formatPrice(amount: number, currency: Currency): string {
  const value = currency === "RWF" ? Math.round(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "RWF" ? 0 : 2,
    maximumFractionDigits: currency === "RWF" ? 0 : 2,
  }).format(value);
}

export function formatPriceIn(
  amount: number,
  from: Currency,
  displayCurrency: Currency,
): string {
  return formatPrice(convert(amount, from, displayCurrency), displayCurrency);
}
