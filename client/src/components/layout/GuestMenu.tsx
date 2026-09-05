"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ProfileIcon } from "./Navbar";

// Same open/close/click-outside/Escape interaction as IconSelect.tsx (the
// only other dropdown in this app), but a status+action panel rather than
// a listbox, so it's its own component instead of reusing IconSelect.
export function GuestMenu({ compact = false }: { compact?: boolean }) {
  const { dictionary } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelClass = compact ? "hidden text-sm font-medium sm:inline" : "text-sm font-medium";

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title={dictionary.auth.guest}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-zinc-600 hover:bg-zinc-100"
      >
        <ProfileIcon filled={false} />
        <span className={labelClass}>{dictionary.auth.guest}</span>
      </button>

      {open && (
        <div className="animate-dropdown-in absolute right-0 z-20 mt-1 w-56 rounded-md border border-zinc-200 bg-white p-3 shadow-lg">
          <p className="mb-3 text-sm text-zinc-600">{dictionary.auth.guestMenuText}</p>
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="mb-2 flex items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            {dictionary.auth.signIn}
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-black hover:bg-zinc-50"
          >
            {dictionary.auth.signUp}
          </Link>
        </div>
      )}
    </div>
  );
}
