"use client";

import Link from "next/link";
import { BrandIcon } from "@/components/marketplace/BrandIcon";
import { CAR_MAKES } from "@/lib/carMakes";

// Same idea as the home page's "Search by Make" section (real logos, real
// listing counts) but sized down, and — unlike the home page — always
// shows every known make rather than hiding ones with no current stock,
// so browsing by brand doesn't silently shrink as inventory changes.
export function BrowseByMakeStrip({ counts }: { counts: Record<string, number> }) {
  const makes = CAR_MAKES.map((make) => ({ ...make, count: counts[make.name] ?? 0 })).sort(
    (a, b) => b.count - a.count,
  );

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {makes.map((make) => (
        <Link
          key={make.name}
          href={`/marketplace?type=vehicle&make=${encodeURIComponent(make.name)}`}
          className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            make.count > 0
              ? "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:shadow-sm"
              : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
          }`}
        >
          <BrandIcon icon={make.icon} className={`h-4 w-4 ${make.count > 0 ? "text-black" : "text-zinc-400"}`} />
          {make.name}
          <span className="text-zinc-400">{make.count > 0 ? `(${make.count})` : "(None)"}</span>
        </Link>
      ))}
    </div>
  );
}
