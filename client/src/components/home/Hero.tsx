"use client";

import Link from "next/link";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { useLocale } from "@/components/providers/LocaleProvider";
import { HeroSearch } from "./HeroSearch";
import { HeroSlider } from "./HeroSlider";

function CarGraphic() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
      <div className="absolute inset-8 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <svg
        viewBox="0 0 240 130"
        className="relative h-full w-full text-black"
        aria-hidden="true"
      >
        <ellipse cx="120" cy="112" rx="95" ry="8" className="fill-black/10" />
        <path
          d="M20 88
             C20 79 26 72 35 70
             L47 68
             C53 52 70 36 96 34
             L142 34
             C164 34 181 48 189 68
             L203 70
             C213 72 220 79 220 88
             L220 94
             L20 94
             Z"
          fill="currentColor"
        />
        <path
          d="M62 68
             C68 54 81 44 96 42
             L138 42
             C155 42 168 52 176 66
             Z"
          className="fill-zinc-50"
        />
        <line x1="119" y1="42" x2="119" y2="68" stroke="currentColor" strokeWidth="2" className="text-zinc-50" />
        <circle cx="68" cy="94" r="18" fill="currentColor" />
        <circle cx="68" cy="94" r="7" className="fill-zinc-50" />
        <circle cx="176" cy="94" r="18" fill="currentColor" />
        <circle cx="176" cy="94" r="7" className="fill-zinc-50" />
      </svg>
    </div>
  );
}

export function Hero({
  images,
  listingCount,
  sellerCount,
}: {
  images: string[];
  listingCount: number;
  sellerCount: number;
}) {
  const { dictionary } = useLocale();

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
      <AmbientBackground />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
            🇷🇼 Autorwa
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
            {dictionary.common.homeTitle}
          </h1>
          <p className="mt-4 max-w-lg text-base text-zinc-600">
            {dictionary.common.homeSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/marketplace?type=vehicle"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              {dictionary.home.browseCars}
            </Link>
            <Link
              href="/marketplace?type=spare_part"
              className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:border-black"
            >
              {dictionary.home.browseSpareParts}
            </Link>
            <Link
              href="/book-call"
              className="px-2 py-2.5 text-sm font-semibold text-accent-dark hover:underline"
            >
              {dictionary.nav.sellWithUs} →
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-200 pt-5 text-sm text-zinc-600">
            <span className="font-semibold text-black">
              {dictionary.home.statsListings.replace("{count}", String(listingCount))}
            </span>
            <span className="font-semibold text-black">
              {dictionary.home.statsSellers.replace("{count}", String(sellerCount))}
            </span>
          </div>
        </div>

        {images.length > 0 ? (
          <HeroSlider images={images} />
        ) : (
          <CarGraphic />
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
        <HeroSearch />
      </div>
    </section>
  );
}
