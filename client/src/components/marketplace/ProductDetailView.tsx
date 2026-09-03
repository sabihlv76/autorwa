"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import { getDailyRate, isRentable, isSellable } from "@/features/products/lib/rental";
import type { Product } from "@/types/product";
import { AddToCartButton } from "./AddToCartButton";
import { FavoriteButton } from "./FavoriteButton";
import { ProductGallery } from "./ProductGallery";
import { ProductSpecs } from "./ProductSpecs";
import { RelatedProducts } from "./RelatedProducts";
import { RentButton } from "./RentButton";
import { SellerCard } from "./SellerCard";

const availabilityStyles: Record<Product["availability"], string> = {
  available: "",
  reserved: "bg-zinc-100 text-zinc-600",
  sold: "bg-zinc-800 text-white",
  out_of_stock: "bg-zinc-100 text-zinc-600",
};

export function ProductDetailView({
  product,
  relatedProducts,
  isFavorited = false,
  favoritedRelatedIds,
}: {
  product: Product;
  relatedProducts: Product[];
  isFavorited?: boolean;
  favoritedRelatedIds?: Set<string>;
}) {
  const { dictionary } = useLocale();
  const { currency } = useCurrency();

  const isUnavailable = product.availability !== "available";
  const rentable = product.type === "vehicle" && isRentable(product);
  const sellable = product.type === "vehicle" ? isSellable(product) : true;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductGallery product={product} />

          <div className="mt-6">
            <h1 className="text-xl font-bold text-black">{product.title}</h1>
            <p className="mt-2 whitespace-pre-line text-sm text-zinc-600">
              {product.description}
            </p>

            <h2 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {dictionary.specs.specifications}
            </h2>
            <ProductSpecs product={product} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              {product.featured && (
                <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                  {dictionary.product.featured}
                </span>
              )}
              {rentable && (
                <span className="rounded bg-black px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                  {dictionary.product.forRentBadge}
                </span>
              )}
              {isUnavailable && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${availabilityStyles[product.availability]}`}
                >
                  {dictionary.product[
                    product.availability === "out_of_stock"
                      ? "outOfStock"
                      : product.availability === "reserved"
                        ? "reserved"
                        : "sold"
                  ]}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-black">
                {formatPriceIn(product.price, product.currency, currency)}
                {!sellable && dictionary.product.perDay}
              </span>
              {product.type === "vehicle" && product.negotiable && sellable && (
                <span className="text-sm text-zinc-500">
                  ({dictionary.product.negotiable})
                </span>
              )}
            </div>
            {product.type === "vehicle" && product.listingType === "both" && (
              <p className="text-sm text-zinc-500">
                {dictionary.product.orRentFrom}{" "}
                {formatPriceIn(getDailyRate(product), product.currency, currency)}
                {dictionary.product.perDay}
              </p>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                {sellable && (
                  <AddToCartButton productId={product.id} disabled={isUnavailable} className="flex-1" />
                )}
                <FavoriteButton productId={product.id} initiallyFavorited={isFavorited} />
              </div>
              {rentable && product.type === "vehicle" && !isUnavailable && (
                <RentButton
                  productId={product.id}
                  dailyRate={getDailyRate(product)}
                  currency={product.currency}
                  minRentalDays={product.minRentalDays}
                  maxRentalDays={product.maxRentalDays}
                />
              )}
            </div>
          </div>

          <SellerCard product={product} />
        </div>
      </div>

      <RelatedProducts products={relatedProducts} favoritedProductIds={favoritedRelatedIds} />
    </div>
  );
}
