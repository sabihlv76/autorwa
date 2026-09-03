"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Product } from "@/types/product";

export function SellerCard({ product }: { product: Product }) {
  const { dictionary } = useLocale();
  const { seller } = product;

  const whatsappDigits = seller.whatsapp.replace(/\D/g, "");
  const message = `Hi, I'm interested in "${product.title}" on Autorwa.`;
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
        className="mt-3 block w-full rounded-md bg-accent px-3 py-2 text-center text-sm font-medium text-white hover:bg-accent-dark"
      >
        {dictionary.specs.chatOnWhatsApp}
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
