"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import type { Product } from "@/types/product";

export function SellerCard({ product }: { product: Product }) {
  const { dictionary } = useLocale();
  const { currency } = useCurrency();
  const { seller } = product;

  const whatsappDigits = seller.whatsapp.replace(/\D/g, "");
  const productUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/products/${product.slug}`;
  const priceLabel = formatPriceIn(product.price, product.currency, currency);

  const message =
    product.type === "vehicle"
      ? [
          dictionary.whatsapp.vehicleGreeting,
          "",
          `${dictionary.whatsapp.vehicleLabel}: ${product.title}`,
          `${dictionary.whatsapp.yearLabel}: ${product.year}`,
          `${dictionary.whatsapp.priceLabel}: ${priceLabel}`,
          `${dictionary.whatsapp.idLabel}: ${product.id}`,
          `${dictionary.whatsapp.linkLabel}: ${productUrl}`,
          "",
          dictionary.whatsapp.closing,
        ].join("\n")
      : `Hi, I'm interested in "${product.title}" on Autorwa.`;

  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;

  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-black">{seller.name}</span>
        {seller.verified && (
          <span
            title={dictionary.product.verifiedSeller}
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
          >
            ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-zinc-500">{seller.location}</p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block w-full rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-white hover:bg-accent-dark"
      >
        {product.type === "vehicle"
          ? dictionary.specs.requestThisCar
          : dictionary.specs.chatOnWhatsApp}
      </a>
      <Link
        href={`/book-call?productId=${product.id}`}
        className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-black hover:border-black"
      >
        {dictionary.specs.bookCall}
      </Link>
    </div>
  );
}
