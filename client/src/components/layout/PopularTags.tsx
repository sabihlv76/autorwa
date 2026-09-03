"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";

const TAGS: { label: string; href: string }[] = [
  { label: "#Toyota", href: "/marketplace?make=Toyota" },
  { label: "#Honda", href: "/marketplace?make=Honda" },
  { label: "#Nissan", href: "/marketplace?make=Nissan" },
  { label: "#SUV", href: "/marketplace?type=vehicle&bodyType=suv" },
  { label: "#ForRent", href: "/marketplace?type=vehicle&rentalOption=rent" },
  { label: "#SpareParts", href: "/marketplace?type=spare_part" },
];

export function PopularTags() {
  const { dictionary } = useLocale();

  return (
    <div className="border-b border-zinc-800 bg-black">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-1.5 sm:px-6 lg:px-8">
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          {dictionary.tags.title}
        </span>
        {TAGS.map((tag) => (
          <Link
            key={tag.label}
            href={tag.href}
            className="shrink-0 text-xs font-medium text-zinc-300 hover:text-accent"
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
