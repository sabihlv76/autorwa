"use client";

import { useActionState, useEffect, useRef } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { convert, formatPrice } from "@/lib/currency";
import {
  confirmWhatsAppOrderAction,
  type ConfirmOrderResult,
} from "@/features/cart/actions/confirmWhatsAppOrder";
import type { SellerOrderGroup as SellerOrderGroupType } from "@/types/cart";
import { CartItemRow } from "./CartItemRow";

const initialState: ConfirmOrderResult = { success: false };

export function SellerOrderGroup({
  group,
  defaultName,
}: {
  group: SellerOrderGroupType;
  defaultName?: string;
}) {
  const { dictionary } = useLocale();
  const { currency } = useCurrency();
  const [state, formAction] = useActionState(confirmWhatsAppOrderAction, initialState);
  const openedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.success && state.whatsappUrl && state.orderReference !== openedRef.current) {
      openedRef.current = state.orderReference;
      window.open(state.whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }, [state]);

  const subtotal = group.items.reduce(
    (sum, item) => sum + convert(item.priceSnapshot, item.currencySnapshot, currency) * item.quantity,
    0,
  );

  if (state.success && state.orderReference) {
    return (
      <div className="rounded-md border border-accent bg-orange-50 p-4">
        <p className="text-sm font-medium text-black">{dictionary.cart.orderCreated}</p>
        <p className="mt-1 text-sm text-zinc-600">
          {dictionary.cart.orderReference}: <span className="font-mono">{state.orderReference}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <h3 className="mb-2 font-semibold text-black">
        {dictionary.cart.itemsFrom.replace("{seller}", group.sellerName)}
      </h3>

      {group.items.map((item) => (
        <CartItemRow key={item.productId} item={item} />
      ))}

      <div className="mt-2 flex justify-between text-sm font-semibold text-black">
        <span>{dictionary.cart.subtotal}</span>
        <span>{formatPrice(subtotal, currency)}</span>
      </div>

      {group.hasIssues ? (
        <p className="mt-3 text-sm text-amber-600">{dictionary.cart.reviewNotice}</p>
      ) : (
        <form action={formAction} className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
          <input type="hidden" name="sellerId" value={group.sellerId} />
          <h4 className="text-sm font-semibold text-black">{dictionary.cart.customerDetails}</h4>

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          <input
            type="text"
            name="name"
            placeholder={dictionary.cart.fullName}
            defaultValue={defaultName}
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="tel"
            name="phone"
            placeholder={dictionary.cart.phone}
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <textarea
            name="notes"
            placeholder={dictionary.cart.notes}
            rows={2}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            {dictionary.cart.confirmAndSend}
          </button>
        </form>
      )}
    </div>
  );
}
