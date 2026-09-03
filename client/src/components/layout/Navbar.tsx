"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";

// Shared with PopularTags, which renders an invisible logo of the exact
// same size as a spacer so its row lines up under the search bar without
// any manual pixel math — see the comment there. Smaller on the narrowest
// screens so the search box next to it still has room to breathe.
export const NAVBAR_LOGO_CLASS = "h-10 w-auto sm:h-12 lg:h-14";

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

function SearchIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { dictionary } = useLocale();
  const { data: session, status } = useSession();
  const labelClass = compact ? "hidden text-sm font-medium sm:inline" : "text-sm font-medium";

  if (status === "authenticated") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        title={dictionary.auth.signOut}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-accent-dark hover:bg-zinc-100"
      >
        <ProfileIcon filled />
        <span className={labelClass}>{session.user.name}</span>
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
      <span className={labelClass}>{dictionary.auth.guest}</span>
    </Link>
  );
}

function CartLink({ cartItemCount }: { cartItemCount: number }) {
  const { dictionary } = useLocale();

  return (
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
  );
}

export function Navbar({ cartItemCount = 0 }: { cartItemCount?: number }) {
  const { dictionary } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Utility row: full icon row from `sm` up; on mobile, just cart +
            hamburger, with the rest tucked into the panel below. */}
        <div className="hidden items-center justify-end gap-3 sm:flex">
          <LanguageSwitcher />
          <AccountMenu compact />
          <CartLink cartItemCount={cartItemCount} />
          <CurrencySwitcher />
        </div>

        <div className="flex items-center justify-between sm:hidden">
          <CartLink cartItemCount={cartItemCount} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={dictionary.nav.menu}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-black hover:border-black"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-nav-menu"
            className="mt-4 flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{dictionary.nav.language}</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{dictionary.nav.currency}</span>
              <CurrencySwitcher />
            </div>
            <AccountMenu />
          </div>
        )}

        {/* Logo + search bar, side by side, at every breakpoint. */}
        <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.svg"
              alt="Autorwa"
              width={266}
              height={100}
              priority
              className={NAVBAR_LOGO_CLASS}
            />
          </Link>

          <form action="/marketplace" method="get" className="min-w-0 flex-1">
            <div className="relative">
              <input
                type="search"
                name="q"
                placeholder={dictionary.nav.searchPlaceholder}
                className="w-full rounded-md border border-zinc-300 py-3.5 pl-5 pr-16 text-base text-black focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                aria-label={dictionary.nav.search}
                title={dictionary.nav.search}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-accent text-white hover:bg-accent-dark"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
