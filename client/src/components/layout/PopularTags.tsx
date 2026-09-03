"use client";

import Image from "next/image";
import Link from "next/link";
import { NAVBAR_LOGO_CLASS } from "./Navbar";

const TAGS: { label: string; href: string }[] = [
  { label: "#Toyota", href: "/marketplace?make=Toyota" },
  { label: "#Honda", href: "/marketplace?make=Honda" },
  { label: "#Nissan", href: "/marketplace?make=Nissan" },
  { label: "#SUV", href: "/marketplace?type=vehicle&bodyType=suv" },
  { label: "#ForRent", href: "/marketplace?type=vehicle&rentalOption=rent" },
  { label: "#SpareParts", href: "/marketplace?type=spare_part" },
];

export function PopularTags() {
  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        {/*
          An invisible copy of the Navbar logo, sized identically via the
          shared NAVBAR_LOGO_CLASS, reserves exactly the same width the real
          logo takes there — so these tags line up under the search bar
          without hardcoding any pixel offsets that would drift the next
          time the logo asset changes.
        */}
        <Image
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          width={266}
          height={100}
          className={`invisible shrink-0 ${NAVBAR_LOGO_CLASS}`}
        />
        <div className="flex items-center gap-7 overflow-x-auto">
          {TAGS.map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="shrink-0 text-sm font-medium text-zinc-500 hover:text-accent"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
