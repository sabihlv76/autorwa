"use client";

import Link from "next/link";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Product } from "@/types/product";

export function VehicleSection({
  variant,
  viewAllHref,
  products,
  favoritedProductIds,
}: {
  variant: "featured" | "latest";
  viewAllHref: string;
  products: Product[];
  favoritedProductIds?: Set<string>;
}) {
  const { dictionary } = useLocale();

  if (products.length === 0) return null;

  const title = variant === "featured" ? dictionary.home.featuredTitle : dictionary.home.latestTitle;
  const subtitle =
    variant === "featured" ? dictionary.home.featuredSubtitle : dictionary.home.latestSubtitle;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-semibold text-accent-dark hover:underline"
        >
          {dictionary.home.viewAll}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorited={favoritedProductIds?.has(product.id) ?? false}
          />
        ))}
      </div>
    </section>
  );
}
