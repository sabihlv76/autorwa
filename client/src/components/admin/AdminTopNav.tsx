"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  links?: NavLink[];
}

function iconWrap(path: ReactNode) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      {path}
    </svg>
  );
}

const ICONS = {
  overview: iconWrap(
    <path
      d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />,
  ),
  products: iconWrap(
    <path
      d="M3 12l2-7h14l2 7M5 12v7h14v-7M5 12h14M9 16h2m2 0h2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ),
  sellers: iconWrap(
    <path
      d="M4 9l1-5h14l1 5M4 9v10h16V9M4 9h16M9 13a2 2 0 1 1-4 0m14 0a2 2 0 1 1-4 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ),
  orders: iconWrap(
    <path
      d="M6 7h12l1 13H5L6 7Zm3 0V5a3 3 0 0 1 6 0v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ),
  calls: iconWrap(
    <path
      d="M6 3h4l1.5 4L9 8.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v4a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 4.5 4.6 1.5 1.5 0 0 1 6 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ),
  ads: iconWrap(
    <path
      d="M3 10v4h3l5 4V6L6 10H3Zm14.5-2.5a5 5 0 0 1 0 9M15 9a2.5 2.5 0 0 1 0 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ),
  users: iconWrap(
    <path
      d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 8c0-3 2.5-5 6-5s6 2 6 5M14 15c3 0 6 1.5 6 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ),
};

const ORDER_STATUSES = ["created", "whatsapp_opened", "customer_confirmed", "processing", "completed", "cancelled"];
const BOOKING_STATUSES = ["requested", "confirmed", "completed", "cancelled", "no_show"];

function humanize(value: string) {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

const NAV_GROUPS: NavGroup[] = [
  { key: "overview", label: "Overview", href: "/ops-console", icon: ICONS.overview },
  {
    key: "products",
    label: "Products",
    href: "/ops-console/products",
    icon: ICONS.products,
    links: [
      { href: "/ops-console/products", label: "All products" },
      { href: "/ops-console/products?new=1", label: "Add product" },
    ],
  },
  {
    key: "sellers",
    label: "Sellers",
    href: "/ops-console/sellers",
    icon: ICONS.sellers,
    links: [
      { href: "/ops-console/sellers", label: "All sellers" },
      { href: "/ops-console/sellers?new=1", label: "Add seller" },
    ],
  },
  {
    key: "orders",
    label: "Orders",
    href: "/ops-console/orders",
    icon: ICONS.orders,
    links: [
      { href: "/ops-console/orders", label: "All orders" },
      ...ORDER_STATUSES.map((s) => ({
        href: `/ops-console/orders?status=${s}`,
        label: humanize(s),
      })),
    ],
  },
  {
    key: "calls",
    label: "Call bookings",
    href: "/ops-console/call-bookings",
    icon: ICONS.calls,
    links: [
      { href: "/ops-console/call-bookings", label: "All bookings" },
      ...BOOKING_STATUSES.map((s) => ({
        href: `/ops-console/call-bookings?status=${s}`,
        label: humanize(s),
      })),
    ],
  },
  {
    key: "ads",
    label: "Advertisements",
    href: "/ops-console/advertisements",
    icon: ICONS.ads,
    links: [
      { href: "/ops-console/advertisements", label: "All advertisements" },
      { href: "/ops-console/advertisements?new=1", label: "Add advertisement" },
    ],
  },
  {
    key: "users",
    label: "Users",
    href: "/ops-console/users",
    icon: ICONS.users,
    links: [
      { href: "/ops-console/users", label: "All users" },
      { href: "/ops-console/users?role=admin", label: "Admins" },
      { href: "/ops-console/users?role=business", label: "Businesses" },
      { href: "/ops-console/users?role=customer", label: "Customers" },
    ],
  },
];

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

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_GROUPS.map((group) => (
            <NavItem
              key={group.key}
              group={group}
              active={pathname === group.href || pathname.startsWith(`${group.href}/`)}
            />
          ))}
        </nav>

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
