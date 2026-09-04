"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Advertisement } from "@/types/product";

export function AdSlot({
  ad,
  variant = "dark",
}: {
  ad: Advertisement | undefined;
  variant?: "dark" | "transparent";
}) {
  const { dictionary } = useLocale();

  if (!ad) {
    return (
      <div className="flex h-12 items-center justify-center rounded-md border border-dashed border-zinc-300 text-xs text-zinc-400 sm:h-14">
        {dictionary.ads.sponsored}
      </div>
    );
  }

  const containerClass =
    variant === "transparent"
      ? "border border-zinc-200/70 bg-transparent text-black hover:bg-zinc-50"
      : "bg-gradient-to-br from-black to-zinc-800 text-white hover:opacity-90";
  const advertiserClass = variant === "transparent" ? "text-zinc-500" : "text-zinc-300";

  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex h-12 flex-col items-center justify-center overflow-hidden rounded-md px-3 py-1.5 text-center transition-opacity sm:h-14 ${containerClass}`}
    >
      {ad.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ad.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <span className="relative z-10 line-clamp-1 text-xs font-medium drop-shadow-sm">
        {ad.title}
      </span>
      <span className={`relative z-10 line-clamp-1 text-[10px] drop-shadow-sm ${advertiserClass}`}>
        {ad.advertiser}
      </span>
    </a>
  );
}
