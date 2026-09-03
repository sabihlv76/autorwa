"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Product } from "@/types/product";

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-100 py-2 text-sm last:border-0">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-medium text-black">{value}</span>
    </div>
  );
}

export function ProductSpecs({ product }: { product: Product }) {
  const { dictionary } = useLocale();
  const conditionLabel = {
    new: dictionary.filters.new,
    used: dictionary.filters.used,
    certified_pre_owned: dictionary.filters.certifiedPreOwned,
  }[product.condition];

  if (product.type === "vehicle") {
    return (
      <div>
        <SpecRow label={dictionary.specs.year} value={product.year} />
        <SpecRow
          label={dictionary.filters.make}
          value={`${product.make} ${product.model}`}
        />
        {(product.generation || product.trim) && (
          <SpecRow
            label={dictionary.specs.generation}
            value={[product.generation, product.trim].filter(Boolean).join(" · ")}
          />
        )}
        <SpecRow label={dictionary.filters.condition} value={conditionLabel} />
        <SpecRow
          label={dictionary.specs.mileage}
          value={`${product.mileageKm.toLocaleString()} km`}
        />
        <SpecRow label={dictionary.filters.fuel} value={dictionary.filters[product.fuel]} />
        <SpecRow
          label={dictionary.filters.transmission}
          value={dictionary.filters[product.transmission]}
        />
        <SpecRow label={dictionary.specs.driveType} value={product.driveType.toUpperCase()} />
        <SpecRow
          label={dictionary.specs.engine}
          value={`${product.engineCapacityL}L`}
        />
        <SpecRow label={dictionary.filters.bodyType} value={product.bodyType} />
        <SpecRow label={dictionary.specs.color} value={product.color} />
        <SpecRow label={dictionary.filters.location} value={product.location} />
        {product.features.length > 0 && (
          <SpecRow label={dictionary.specs.features} value={product.features.join(", ")} />
        )}
        {(product.listingType === "rent" || product.listingType === "both") && (
          <>
            <SpecRow
              label={dictionary.specs.minRentalDays}
              value={dictionary.specs.days.replace("{count}", String(product.minRentalDays))}
            />
            {product.maxRentalDays && (
              <SpecRow
                label={dictionary.specs.maxRentalDays}
                value={dictionary.specs.days.replace("{count}", String(product.maxRentalDays))}
              />
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <SpecRow label={dictionary.specs.brand} value={product.brand} />
      <SpecRow label={dictionary.specs.partNumber} value={product.partNumber} />
      <SpecRow label={dictionary.filters.category} value={product.category} />
      <SpecRow label={dictionary.filters.condition} value={conditionLabel} />
      <SpecRow label={dictionary.specs.stock} value={product.stock} />
      {(product.compatibleMakes.length > 0 || product.compatibleModels.length > 0) && (
        <SpecRow
          label={dictionary.specs.compatibility}
          value={[...product.compatibleMakes, ...product.compatibleModels].join(", ")}
        />
      )}
      {product.compatibleYears && (
        <SpecRow
          label={dictionary.specs.year}
          value={`${product.compatibleYears[0]}–${product.compatibleYears[1]}`}
        />
      )}
      {product.compatibilityNotes && (
        <SpecRow label={dictionary.specs.compatibility} value={product.compatibilityNotes} />
      )}
      {product.warrantyMonths && (
        <SpecRow
          label={dictionary.specs.warranty}
          value={dictionary.specs.warrantyMonths.replace(
            "{months}",
            String(product.warrantyMonths),
          )}
        />
      )}
    </div>
  );
}
