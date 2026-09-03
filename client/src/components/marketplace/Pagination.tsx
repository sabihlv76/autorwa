"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { buildQueryString } from "@/features/products/lib/searchParams";

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const { dictionary } = useLocale();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  function hrefForPage(target: number) {
    const qs = buildQueryString(currentParams, { page: target });
    return qs ? `/marketplace?${qs}` : "/marketplace";
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-6 flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <Link
          href={hrefForPage(page - 1)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 font-medium text-black hover:border-black"
        >
          {dictionary.pagination.previous}
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-md border border-zinc-200 px-3 py-1.5 font-medium text-zinc-300">
          {dictionary.pagination.previous}
        </span>
      )}

      <span className="text-zinc-600">
        {dictionary.pagination.pageOf
          .replace("{page}", String(page))
          .replace("{total}", String(totalPages))}
      </span>

      {page < totalPages ? (
        <Link
          href={hrefForPage(page + 1)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 font-medium text-black hover:border-black"
        >
          {dictionary.pagination.next}
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-md border border-zinc-200 px-3 py-1.5 font-medium text-zinc-300">
          {dictionary.pagination.next}
        </span>
      )}
    </nav>
  );
}
