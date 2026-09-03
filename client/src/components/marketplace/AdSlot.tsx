"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Advertisement } from "@/types/product";

export function AdSlot({ ad }: { ad: Advertisement | undefined }) {
  const { dictionary } = useLocale();

  if (!ad) {
    return (
      <div className="flex h-12 items-center justify-center rounded-md border border-dashed border-zinc-300 text-xs text-zinc-400 sm:h-14">
        {dictionary.ads.sponsored}
      </div>
    );
  }

  return (
    <a
      href={ad.targetUrl}
      className="flex h-12 flex-col items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-black to-zinc-800 px-3 py-1.5 text-center text-white transition-opacity hover:opacity-90 sm:h-14"
    >
      <span className="line-clamp-1 text-xs font-medium">{ad.title}</span>
      <span className="line-clamp-1 text-[10px] text-zinc-300">{ad.advertiser}</span>
    </a>
  );
}
