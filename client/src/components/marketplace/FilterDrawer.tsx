"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Seller } from "@/types/product";
import { FilterPanel } from "./FilterPanel";

export function FilterDrawer({ sellers }: { sellers: Seller[] }) {
  const { dictionary } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-black"
      >
        {dictionary.filters.openFilters}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black">
                {dictionary.filters.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-zinc-500 hover:text-black"
              >
                {dictionary.filters.closeFilters}
              </button>
            </div>
            <FilterPanel sellers={sellers} onApply={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
