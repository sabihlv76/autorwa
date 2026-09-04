"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { buildQueryString } from "@/features/products/lib/searchParams";

export function PostedWithinSelect() {
  const { dictionary } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());
  const postedWithin = currentParams.postedWithin ?? "all";

  function onChange(value: string) {
    const qs = buildQueryString(currentParams, { postedWithin: value === "all" ? null : value });
    router.push(qs ? `/marketplace?${qs}` : "/marketplace");
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <select
        value={postedWithin}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
      >
        <option value="all">{dictionary.sort.anyTime}</option>
        <option value="24h">{dictionary.sort.last24h}</option>
        <option value="7d">{dictionary.sort.last7d}</option>
        <option value="30d">{dictionary.sort.last30d}</option>
      </select>
    </label>
  );
}
