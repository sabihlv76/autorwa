"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { buildQueryString, parseSort } from "@/features/products/lib/searchParams";

export function SortDropdown() {
  const { dictionary } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());
  const sort = parseSort(currentParams);

  function onChange(value: string) {
    const qs = buildQueryString(currentParams, { sort: value });
    router.push(qs ? `/marketplace?${qs}` : "/marketplace");
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-zinc-600">{dictionary.sort.label}</span>
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
      >
        <option value="newest">{dictionary.sort.newest}</option>
        <option value="oldest">{dictionary.sort.oldest}</option>
        <option value="price_asc">{dictionary.sort.priceAsc}</option>
        <option value="price_desc">{dictionary.sort.priceDesc}</option>
      </select>
    </label>
  );
}
