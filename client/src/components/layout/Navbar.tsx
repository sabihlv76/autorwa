"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";

function ProfileIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth={filled ? 0 : 1.6} />
      <path
        d="M4.5 20c1.2-3.6 4.3-5.5 7.5-5.5s6.3 1.9 7.5 5.5"
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 4h2l1.2 11.4A2 2 0 0 0 8.2 17H18a2 2 0 0 0 2-1.7L21.3 8H6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20.5" r="1.3" fill="currentColor" />
      <circle cx="18" cy="20.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function AccountMenu() {
  const { dictionary } = useLocale();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        title={dictionary.auth.signOut}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-accent-dark hover:bg-zinc-100"
      >
        <ProfileIcon filled />
        <span className="hidden text-sm font-medium sm:inline">{session.user.name}</span>
      </button>
    );
  }

  return (
    <Link
      href="/signup"
      title={dictionary.auth.signUp}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-zinc-600 hover:bg-zinc-100"
    >
      <ProfileIcon filled={false} />
      <span className="hidden text-sm font-medium sm:inline">{dictionary.auth.guest}</span>
    </Link>
  );
}

export function Navbar({ cartItemCount = 0 }: { cartItemCount?: number }) {
  const { dictionary } = useLocale();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Autorwa"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-black">
              AUTO<span className="text-accent">RWA</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <CurrencySwitcher />
            <AccountMenu />
            <Link
              href="/cart"
              aria-label={dictionary.nav.cart}
              title={dictionary.nav.cart}
              className="relative flex h-9 w-9 items-center justify-center rounded-md bg-black text-white hover:bg-zinc-800"
            >
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <form action="/marketplace" method="get" className="mt-3">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              name="q"
              placeholder={dictionary.nav.searchPlaceholder}
              className="w-full rounded-md border border-zinc-300 py-3.5 pl-11 pr-4 text-base text-black focus:border-accent focus:outline-none"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
