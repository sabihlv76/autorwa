"use client";

import Link from "next/link";
import { ProductPlaceholderIcon } from "@/components/marketplace/ProductPlaceholderIcon";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { BodyType } from "@/types/product";

const BODY_TYPES: BodyType[] = [
  "sedan",
  "suv",
  "hatchback",
  "pickup",
  "van",
  "coupe",
  "wagon",
  "minibus",
];

export function SearchByType({ counts }: { counts: Record<string, number> }) {
  const { dictionary } = useLocale();

  const types = BODY_TYPES.map((bodyType) => ({
    bodyType,
    count: counts[bodyType] ?? 0,
  })).filter((t) => t.count > 0);

  if (types.length === 0) return null;

  return (
    <section className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {dictionary.home.typesTitle}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{dictionary.home.typesSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {types.map(({ bodyType, count }) => (
            <Link
              key={bodyType}
              href={`/marketplace?type=vehicle&bodyType=${bodyType}`}
              className="flex flex-col items-center gap-2 rounded-md border border-zinc-200 bg-white p-4 text-center transition-shadow hover:border-zinc-300 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
                <ProductPlaceholderIcon type="vehicle" className="h-5 w-5 text-accent-dark" />
              </span>
              <span className="text-sm font-semibold text-black">
                {dictionary.vehicleType[bodyType]}
              </span>
              <span className="text-xs text-zinc-500">
                {dictionary.home.listingsSuffix.replace("{count}", String(count))}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
