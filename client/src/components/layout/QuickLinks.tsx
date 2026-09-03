"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";

export function QuickLinks() {
  const { dictionary } = useLocale();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") ?? "all";
  const isRentActive = searchParams.get("rentalOption") === "rent";

  const linkClass = (isActive: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent text-white"
        : "text-black hover:bg-zinc-100"
    }`;

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-6 lg:px-8">
        <span aria-hidden="true" className="hidden sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/marketplace"
            className={linkClass(activeType === "all" && !isRentActive)}
          >
            {dictionary.filters.all}
          </Link>
          <Link
            href="/marketplace?type=vehicle"
            className={linkClass(activeType === "vehicle" && !isRentActive)}
          >
            {dictionary.nav.cars}
          </Link>
          <Link
            href="/marketplace?type=spare_part"
            className={linkClass(activeType === "spare_part")}
          >
            {dictionary.nav.spareParts}
          </Link>
          <Link
            href="/marketplace?type=vehicle&rentalOption=rent"
            className={linkClass(isRentActive)}
          >
            {dictionary.nav.rent}
          </Link>
        </div>
        <Link
          href="/book-call"
          className="shrink-0 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-dark hover:bg-accent/20 sm:justify-self-end"
        >
          {dictionary.nav.sellWithUs}
        </Link>
      </div>
    </nav>
  );
}
