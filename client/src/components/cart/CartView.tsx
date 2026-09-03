"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SellerOrderGroup as SellerOrderGroupType } from "@/types/cart";
import { SellerOrderGroup } from "./SellerOrderGroup";

export function CartView({
  groups,
  defaultName,
}: {
  groups: SellerOrderGroupType[];
  defaultName?: string;
}) {
  const { dictionary } = useLocale();

  if (groups.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-xl font-bold text-black">{dictionary.cart.title}</h1>
        <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center">
          <p className="text-sm text-zinc-500">{dictionary.cart.empty}</p>
          <Link
            href="/marketplace"
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            {dictionary.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">{dictionary.cart.title}</h1>
      <div className="space-y-6">
        {groups.map((group) => (
          <SellerOrderGroup key={group.sellerId} group={group} defaultName={defaultName} />
        ))}
      </div>
    </div>
  );
}
