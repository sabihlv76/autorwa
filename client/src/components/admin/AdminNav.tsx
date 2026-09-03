"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const LINKS = [
  { href: "/ops-console", label: "Overview" },
  { href: "/ops-console/products", label: "Products" },
  { href: "/ops-console/sellers", label: "Sellers" },
  { href: "/ops-console/orders", label: "Orders" },
  { href: "/ops-console/call-bookings", label: "Call bookings" },
  { href: "/ops-console/advertisements", label: "Advertisements" },
  { href: "/ops-console/users", label: "Users" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-zinc-200 bg-white p-4">
      <div className="mb-6 text-lg font-bold tracking-tight text-black">
        AUTO<span className="text-accent">RWA</span>{" "}
        <span className="text-xs font-normal text-zinc-400">admin</span>
      </div>
      <ul className="space-y-1">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-accent text-white"
                  : "text-black hover:bg-zinc-100"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 w-full rounded-md border border-zinc-300 px-3 py-2 text-left text-sm font-medium text-zinc-600 hover:border-black hover:text-black"
      >
        Sign out
      </button>
    </nav>
  );
}
