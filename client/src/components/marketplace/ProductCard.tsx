"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import { getDailyRate, isRentable, isSellable } from "@/features/products/lib/rental";
import type { Product } from "@/types/product";
import { AddToCartButton } from "./AddToCartButton";
import { FavoriteButton } from "./FavoriteButton";
import { ProductPlaceholderIcon } from "./ProductPlaceholderIcon";
import { RentButton } from "./RentButton";

const availabilityStyles: Record<Product["availability"], string> = {
  available: "",
  reserved: "bg-zinc-100 text-zinc-600",
  sold: "bg-zinc-800 text-white",
  out_of_stock: "bg-zinc-100 text-zinc-600",
};

const conditionStyles: Record<Product["condition"], string> = {
  new: "bg-green-600 text-white",
  used: "bg-zinc-700 text-white",
  certified_pre_owned: "bg-zinc-700 text-white",
};

function yearsActive(createdAt?: string): number | null {
  if (!createdAt) return null;
  const years = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (365 * 24 * 60 * 60 * 1000),
  );
  return years;
}

export function ProductCard({
  product,
  isFavorited = false,
}: {
  product: Product;
  isFavorited?: boolean;
}) {
  const { dictionary } = useLocale();
  const { currency } = useCurrency();

  const specs =
    product.type === "vehicle"
      ? `${product.year} · ${product.mileageKm.toLocaleString()} km · ${product.location}`
      : `${product.brand} · ${product.partNumber}`;

  const isUnavailable = product.availability !== "available";
  const rentable = product.type === "vehicle" && isRentable(product);
  const sellable = product.type === "vehicle" ? isSellable(product) : true;
  const location = product.type === "spare_part" ? product.seller.location : undefined;
  const years = yearsActive(product.seller.createdAt);
  const conditionLabel =
    product.condition === "new"
      ? dictionary.filters.new
      : product.condition === "used"
        ? dictionary.filters.used
        : dictionary.filters.certifiedPreOwned;

  const image = product.images[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-zinc-200 bg-white transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative flex h-36 items-center justify-center overflow-hidden bg-zinc-50"
      >
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ProductPlaceholderIcon type={product.type} />
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
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
        </div>
        {isUnavailable && (
          <span
            className={`absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${availabilityStyles[product.availability]}`}
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
        <span
          className={`absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${conditionStyles[product.condition]}`}
        >
          {conditionLabel}
        </span>
        <FavoriteButton
          productId={product.id}
          initiallyFavorited={isFavorited}
          className="absolute bottom-2 right-2"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-sm font-semibold text-black hover:text-accent"
        >
          {product.title}
        </Link>
        <span className="text-xs text-zinc-500">{specs}</span>
        {location && <span className="text-xs text-zinc-500">{location}</span>}
        <p className="line-clamp-2 text-xs text-zinc-500">{product.description}</p>

        <div className="mt-1 flex flex-wrap items-baseline gap-1">
          {sellable ? (
            <span className="text-base font-bold text-black">
              {formatPriceIn(product.price, product.currency, currency)}
            </span>
          ) : (
            <span className="text-base font-bold text-black">
              {formatPriceIn(product.price, product.currency, currency)}
              {dictionary.product.perDay}
            </span>
          )}
          {product.type === "vehicle" && product.negotiable && sellable && (
            <span className="text-xs text-zinc-500">
              ({dictionary.product.negotiable})
            </span>
          )}
        </div>
        {product.type === "vehicle" && product.listingType === "both" && (
          <span className="text-xs text-zinc-500">
            {dictionary.product.orRentFrom}{" "}
            {formatPriceIn(getDailyRate(product), product.currency, currency)}
            {dictionary.product.perDay}
          </span>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-zinc-500">
          <span className="line-clamp-1">{product.seller.name}</span>
          {product.seller.verified && (
            <span
              title={dictionary.product.verifiedSeller}
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-600 text-[9px] font-bold text-white"
            >
              ✓
            </span>
          )}
          {product.seller.enterprise && (
            <span className="rounded bg-green-50 px-1 py-0.5 text-[9px] font-bold uppercase text-green-700">
              Enterprise
            </span>
          )}
          {years !== null && years > 0 && (
            <span className="text-[10px] text-zinc-400">
              {dictionary.product.yearsActive.replace("{count}", String(years))}
            </span>
          )}
          {product.seller.rating && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-zinc-600">
              <span className="text-amber-500">★</span>
              {product.seller.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-2 space-y-1">
          {sellable && (
            <AddToCartButton productId={product.id} disabled={isUnavailable} />
          )}
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
    </div>
  );
}
