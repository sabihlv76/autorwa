"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { ProductType } from "@/types/product";
import { BrowseByMakeStrip } from "./BrowseByMakeStrip";
import { CategoryStrip } from "./CategoryStrip";

export function MarketplaceIntro({
  type,
  activeCategory,
  activeBodyType,
  makeCounts,
}: {
  type: ProductType | "all";
  activeCategory?: string;
  activeBodyType?: string;
  makeCounts?: Record<string, number>;
}) {
  const { dictionary } = useLocale();

  const title =
    type === "spare_part"
      ? dictionary.common.sparePartsTitle
      : type === "vehicle"
        ? dictionary.common.vehiclesTitle
        : dictionary.common.browseTitle;

  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-black">{title}</h1>
      {type === "vehicle" && <BrowseByMakeStrip counts={makeCounts ?? {}} />}
      {(type === "vehicle" || type === "spare_part") && (
        <CategoryStrip
          type={type}
          activeCategory={activeCategory}
          activeBodyType={activeBodyType}
        />
      )}
    </div>
  );
}
