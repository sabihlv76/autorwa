"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import { addToCartAction } from "@/features/cart/actions/addToCart";
import type { Currency } from "@/types/product";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function RentButton({
  productId,
  dailyRate,
  currency,
  minRentalDays,
  maxRentalDays,
}: {
  productId: string;
  dailyRate: number;
  currency: Currency;
  minRentalDays: number;
  maxRentalDays?: number;
}) {
  const { dictionary } = useLocale();
  const { currency: displayCurrency } = useCurrency();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const days =
    startDate && endDate
      ? Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (24 * 60 * 60 * 1000),
        )
      : 0;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await addToCartAction(productId, 1, { startDate, endDate });
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error ?? "Could not add rental to cart.");
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-md border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-orange-50"
      >
        {dictionary.product.forRentBadge}
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-zinc-200 p-2">
      <p className="text-xs font-medium text-zinc-600">{dictionary.cart.pickRentalDates}</p>
      <div className="flex gap-2">
        <input
          type="date"
          min={todayISODate()}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label={dictionary.cart.rentalStartDate}
          className="w-1/2 rounded-md border border-zinc-300 px-2 py-1 text-xs"
        />
        <input
          type="date"
          min={startDate || todayISODate()}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label={dictionary.cart.rentalEndDate}
          className="w-1/2 rounded-md border border-zinc-300 px-2 py-1 text-xs"
        />
      </div>
      {days > 0 && (
        <p className="text-xs text-zinc-500">
          {dictionary.cart.rentalDays.replace("{days}", String(days))} ·{" "}
          {formatPriceIn(dailyRate * days, currency, displayCurrency)}
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!startDate || !endDate || isPending}
          className="flex-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-zinc-200"
        >
          {dictionary.product.forRentBadge}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600"
        >
          ×
        </button>
      </div>
      <p className="text-[10px] text-zinc-400">
        {minRentalDays > 1 ? `Min ${minRentalDays} days` : ""}
        {maxRentalDays ? ` · Max ${maxRentalDays} days` : ""}
      </p>
    </div>
  );
}
