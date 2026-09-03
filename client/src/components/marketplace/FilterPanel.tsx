"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { buildQueryString, parseFilters } from "@/features/products/lib/searchParams";
import { CAR_MAKES } from "@/lib/carMakes";
import type { FilterState, Seller } from "@/types/product";
import { BrandIcon } from "./BrandIcon";

const BODY_TYPES = [
  "sedan",
  "suv",
  "hatchback",
  "pickup",
  "van",
  "coupe",
  "wagon",
  "minibus",
] as const;

export function FilterPanel({
  sellers,
  onApply,
}: {
  sellers: Seller[];
  onApply?: () => void;
}) {
  const { dictionary } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());
  const [filters, setFilters] = useState<FilterState>(() =>
    parseFilters(currentParams),
  );

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function apply() {
    const qs = buildQueryString(currentParams, {
      type: filters.type === "all" ? null : filters.type,
      make: filters.make || null,
      category: filters.category || null,
      condition: filters.condition === "all" ? null : filters.condition,
      fuel: filters.fuel === "all" ? null : filters.fuel,
      transmission: filters.transmission === "all" ? null : filters.transmission,
      bodyType: filters.bodyType === "all" ? null : filters.bodyType,
      location: filters.location || null,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minYear: filters.minYear,
      maxYear: filters.maxYear,
      maxMileageKm: filters.maxMileageKm,
      seller: filters.seller || null,
      rentalOption: filters.rentalOption === "all" ? null : filters.rentalOption,
    });
    router.push(qs ? `/marketplace?${qs}` : "/marketplace");
    onApply?.();
  }

  function reset() {
    router.push("/marketplace");
    onApply?.();
  }

  const showVehicleFields = filters.type !== "spare_part";

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          {dictionary.filters.type}
        </label>
        <select
          value={filters.type}
          onChange={(e) => update("type", e.target.value as FilterState["type"])}
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
        >
          <option value="all">{dictionary.filters.all}</option>
          <option value="vehicle">{dictionary.filters.vehicle}</option>
          <option value="spare_part">{dictionary.filters.sparePart}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          {dictionary.filters.make}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {CAR_MAKES.map((carMake) => {
            const isSelected = filters.make.toLowerCase() === carMake.name.toLowerCase();
            return (
              <button
                key={carMake.name}
                type="button"
                title={carMake.name}
                aria-pressed={isSelected}
                onClick={() => update("make", isSelected ? "" : carMake.name)}
                className={`flex flex-col items-center gap-1 rounded-md border px-1 py-1.5 text-[10px] transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent-dark"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                }`}
              >
                <BrandIcon icon={carMake.icon} className="h-4 w-4" />
                <span className="truncate">{carMake.name}</span>
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={filters.make}
          onChange={(e) => update("make", e.target.value)}
          placeholder={dictionary.filters.orTypeMake}
          className="mt-2 w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
        />
      </div>

      {filters.type !== "vehicle" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">
            {dictionary.filters.category}
          </label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder={dictionary.filters.anyCategory}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          {dictionary.filters.condition}
        </label>
        <select
          value={filters.condition}
          onChange={(e) =>
            update("condition", e.target.value as FilterState["condition"])
          }
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
        >
          <option value="all">{dictionary.filters.all}</option>
          <option value="new">{dictionary.filters.new}</option>
          <option value="used">{dictionary.filters.used}</option>
          <option value="certified_pre_owned">
            {dictionary.filters.certifiedPreOwned}
          </option>
        </select>
      </div>

      {showVehicleFields && (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              {dictionary.filters.fuel}
            </label>
            <select
              value={filters.fuel}
              onChange={(e) => update("fuel", e.target.value as FilterState["fuel"])}
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
            >
              <option value="all">{dictionary.filters.all}</option>
              <option value="petrol">{dictionary.filters.petrol}</option>
              <option value="diesel">{dictionary.filters.diesel}</option>
              <option value="hybrid">{dictionary.filters.hybrid}</option>
              <option value="electric">{dictionary.filters.electric}</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              {dictionary.filters.transmission}
            </label>
            <select
              value={filters.transmission}
              onChange={(e) =>
                update("transmission", e.target.value as FilterState["transmission"])
              }
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
            >
              <option value="all">{dictionary.filters.all}</option>
              <option value="manual">{dictionary.filters.manual}</option>
              <option value="automatic">{dictionary.filters.automatic}</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              {dictionary.filters.bodyType}
            </label>
            <select
              value={filters.bodyType}
              onChange={(e) =>
                update("bodyType", e.target.value as FilterState["bodyType"])
              }
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
            >
              <option value="all">{dictionary.filters.all}</option>
              {BODY_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              {dictionary.filters.rentalOption}
            </label>
            <select
              value={filters.rentalOption}
              onChange={(e) =>
                update("rentalOption", e.target.value as FilterState["rentalOption"])
              }
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
            >
              <option value="all">{dictionary.filters.all}</option>
              <option value="sale">{dictionary.filters.forSale}</option>
              <option value="rent">{dictionary.filters.forRent}</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              {dictionary.filters.yearRange}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minYear ?? ""}
                onChange={(e) =>
                  update("minYear", e.target.value ? Number(e.target.value) : null)
                }
                placeholder={dictionary.filters.minYear}
                className="w-1/2 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                value={filters.maxYear ?? ""}
                onChange={(e) =>
                  update("maxYear", e.target.value ? Number(e.target.value) : null)
                }
                placeholder={dictionary.filters.maxYear}
                className="w-1/2 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              {dictionary.filters.maxMileage}
            </label>
            <input
              type="number"
              value={filters.maxMileageKm ?? ""}
              onChange={(e) =>
                update(
                  "maxMileageKm",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          {dictionary.filters.priceRange}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              update("minPrice", e.target.value ? Number(e.target.value) : null)
            }
            placeholder={dictionary.filters.minPrice}
            className="w-1/2 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              update("maxPrice", e.target.value ? Number(e.target.value) : null)
            }
            placeholder={dictionary.filters.maxPrice}
            className="w-1/2 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          {dictionary.filters.location}
        </label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder={dictionary.filters.anyLocation}
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          {dictionary.filters.seller}
        </label>
        <select
          value={filters.seller}
          onChange={(e) => update("seller", e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
        >
          <option value="">{dictionary.filters.anySeller}</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={apply}
          className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          {dictionary.filters.apply}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-black hover:border-black"
        >
          {dictionary.filters.reset}
        </button>
      </div>
    </div>
  );
}
