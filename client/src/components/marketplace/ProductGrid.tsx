"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  totalItems,
  favoritedProductIds,
}: {
  products: Product[];
  totalItems: number;
  favoritedProductIds?: Set<string>;
}) {
  const { dictionary } = useLocale();

  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
        {dictionary.common.noResults}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-zinc-500">
        {dictionary.common.results.replace("{count}", String(totalItems))}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorited={favoritedProductIds?.has(product.id) ?? false}
          />
        ))}
      </div>
    </div>
  );
}
