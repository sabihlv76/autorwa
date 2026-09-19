"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BOTTOM_NAV_CORE_KEYS, ICONS, NAV_GROUPS } from "./adminNav";

const coreGroups = NAV_GROUPS.filter((g) => BOTTOM_NAV_CORE_KEYS.includes(g.key));
const moreGroups = NAV_GROUPS.filter((g) => !BOTTOM_NAV_CORE_KEYS.includes(g.key));

/** Mobile-only bottom tab bar: a handful of core links stay one thumb-tap
 * away, everything else lives behind "More" — the admin's most common
 * audience is checking/managing things from a phone, so the cramped
 * horizontal scroll of the full desktop nav (AdminTopNav) isn't usable here. */
export function AdminBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the "More" sheet after a navigation — adjusted during render
  // (React's documented pattern for resyncing state to a changed prop)
  // rather than in an effect, since setState synchronously inside an
  // effect body trips this project's react-hooks/set-state-in-effect rule.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMoreOpen(false);
  }

  useEffect(() => {
    if (!moreOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [moreOpen]);

  const moreActive = moreGroups.some(
    (g) => pathname === g.href || pathname.startsWith(`${g.href}/`),
  );

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            aria-hidden="true"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="animate-modal-in absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-zinc-200 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-zinc-200" />
            <div className="grid grid-cols-3 gap-2 px-4 pb-2 pt-3">
              {moreGroups.map((group) => (
                <Link
                  key={group.key}
                  href={group.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center text-xs font-medium ${
                    pathname === group.href || pathname.startsWith(`${group.href}/`)
                      ? "bg-accent/10 text-accent-dark"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <span aria-hidden="true">{group.icon}</span>
                  {group.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Admin"
      >
        <div className="grid grid-cols-5">
          {coreGroups.map((group) => {
            const active = pathname === group.href || pathname.startsWith(`${group.href}/`);
            return (
              <Link
                key={group.key}
                href={group.href}
                className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${
                  active ? "text-accent-dark" : "text-zinc-500"
                }`}
              >
                <span aria-hidden="true">{group.icon}</span>
                {group.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${
              moreActive || moreOpen ? "text-accent-dark" : "text-zinc-500"
            }`}
          >
            <span aria-hidden="true">{ICONS.more}</span>
            More
          </button>
        </div>
      </nav>
    </>
  );
}
