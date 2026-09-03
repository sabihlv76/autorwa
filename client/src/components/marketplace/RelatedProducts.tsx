"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({
  products,
  favoritedProductIds,
}: {
  products: Product[];
  favoritedProductIds?: Set<string>;
}) {
  const { dictionary } = useLocale();

  if (products.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-black">
        {dictionary.specs.relatedProducts}
      </h2>
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
