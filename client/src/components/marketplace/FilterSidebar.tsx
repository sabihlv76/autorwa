"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Seller } from "@/types/product";
import { FilterPanel } from "./FilterPanel";

export function FilterSidebar({ sellers }: { sellers: Seller[] }) {
  const { dictionary } = useLocale();

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-4 rounded-md border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-black">
          {dictionary.filters.title}
        </h2>
        <FilterPanel sellers={sellers} />
      </div>
    </aside>
  );
}
