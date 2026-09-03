"use client";

import Link from "next/link";
import { BrandIcon } from "@/components/marketplace/BrandIcon";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CAR_MAKES } from "@/lib/carMakes";

export function SearchByMake({ counts }: { counts: Record<string, number> }) {
  const { dictionary } = useLocale();

  const makes = CAR_MAKES.map((make) => ({ ...make, count: counts[make.name] ?? 0 }))
    .filter((make) => make.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  if (makes.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {dictionary.home.makesTitle}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{dictionary.home.makesSubtitle}</p>
        </div>
        <Link
          href="/marketplace?type=vehicle"
          className="shrink-0 text-sm font-semibold text-accent-dark hover:underline"
        >
          {dictionary.home.makesViewAll}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {makes.map((make) => (
          <Link
            key={make.name}
            href={`/marketplace?type=vehicle&make=${encodeURIComponent(make.name)}`}
            className="flex flex-col items-center gap-2 rounded-md border border-zinc-200 bg-white p-4 text-center transition-shadow hover:border-zinc-300 hover:shadow-md"
          >
            <BrandIcon icon={make.icon} className="h-8 w-8 text-black" />
            <span className="text-sm font-semibold text-black">{make.name}</span>
            <span className="text-xs text-zinc-500">
              {dictionary.home.listingsSuffix.replace("{count}", String(make.count))}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
