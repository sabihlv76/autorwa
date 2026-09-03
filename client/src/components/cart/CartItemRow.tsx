"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import { removeItemAction } from "@/features/cart/actions/removeItem";
import { updateQuantityAction } from "@/features/cart/actions/updateQuantity";
import { ProductPlaceholderIcon } from "@/components/marketplace/ProductPlaceholderIcon";
import type { RehydratedCartItem } from "@/types/cart";

export function CartItemRow({ item }: { item: RehydratedCartItem }) {
  const { dictionary } = useLocale();
  const { currency } = useCurrency();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const product = item.product;

  function handleQuantityChange(newQuantity: number) {
    startTransition(async () => {
      await updateQuantityAction(item.productId, newQuantity);
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeItemAction(item.productId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 border-b border-zinc-100 py-3 last:border-0">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-zinc-50">
        {product ? (
          <ProductPlaceholderIcon type={product.type} className="h-8 w-8 text-zinc-300" />
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {product ? (
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-1 text-sm font-medium text-black hover:text-accent"
          >
            {product.title}
          </Link>
        ) : (
          <span className="text-sm font-medium text-zinc-400">Unavailable product</span>
        )}

        {item.unavailable && (
          <p className="text-xs text-red-600">{dictionary.cart.unavailableItem}</p>
        )}
        {!item.unavailable && item.priceChanged && (
          <p className="text-xs text-amber-600">{dictionary.cart.priceChanged}</p>
        )}

        {item.isRental && item.rentalStartDate && item.rentalEndDate ? (
          <p className="mt-1 text-xs text-zinc-500">
            {dictionary.cart.rentalPeriod}: {item.rentalStartDate.slice(0, 10)} →{" "}
            {item.rentalEndDate.slice(0, 10)} (
            {dictionary.cart.rentalDays.replace("{days}", String(item.rentalDays ?? 0))})
          </p>
        ) : null}

        <div className="mt-1 flex items-center gap-3">
          {!item.isRental && (
            <label className="flex items-center gap-1 text-xs text-zinc-500">
              {dictionary.cart.quantity}
              <input
                type="number"
                min={0}
                max={999}
                defaultValue={item.quantity}
                disabled={isPending}
                onBlur={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-14 rounded-md border border-zinc-300 px-1.5 py-0.5 text-sm"
              />
            </label>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="text-xs font-medium text-zinc-500 hover:text-red-600"
          >
            {dictionary.cart.remove}
          </button>
        </div>
      </div>

      <span className="shrink-0 text-sm font-semibold text-black">
        {formatPriceIn(item.priceSnapshot * item.quantity, item.currencySnapshot, currency)}
      </span>
    </div>
  );
}
