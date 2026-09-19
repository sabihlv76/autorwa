"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";
import { NAV_GROUPS, type NavGroup } from "./adminNav";

function NavItem({ group, active }: { group: NavGroup; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function measure() {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 4, left: r.left });
  }

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    measure();
    setOpen(true);
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  // The dropdown is portaled to <body> (so a sticky nav's clipped overflow
  // can't cut it off), which puts it outside rootRef in the real DOM even
  // though React treats it as a child — outside-click detection has to
  // check both nodes, not just rootRef.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", measure, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open]);

  if (!group.links) {
    return (
      <Link
        href={group.href}
        className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          active ? "bg-accent/10 text-accent-dark" : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
        }`}
      >
        <span aria-hidden="true">{group.icon}</span>
        {group.label}
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative shrink-0" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openNow())}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          active ? "bg-accent/10 text-accent-dark" : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
        }`}
      >
        <span aria-hidden="true">{group.icon}</span>
        {group.label}
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-zinc-400">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            style={{ top: menuPos.top, left: menuPos.left }}
            className="animate-dropdown-in fixed z-40 min-w-[13rem] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1.5 shadow-lg"
          >
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-3.5 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

export function AdminTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/ops-console" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.svg" alt="AUTORWA" width={132} height={40} className="h-8 w-auto" priority />
          <span className="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 sm:inline">
            Admin
          </span>
        </Link>

        {/* Below md the full 7-group row has no room to breathe (see the
            mobile-cramped-nav complaint) — AdminBottomNav takes over there
            with a handful of core links instead. */}
        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
          {NAV_GROUPS.map((group) => (
            <NavItem
              key={group.key}
              group={group}
              active={pathname === group.href || pathname.startsWith(`${group.href}/`)}
            />
          ))}
        </nav>
        <div className="flex-1 md:hidden" />

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-black hover:text-black"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m6 14l5-5-5-5m5 5H9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
