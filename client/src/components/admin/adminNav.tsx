import type { ReactNode } from "react";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavGroup {
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

export const ICONS = {
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
  more: iconWrap(
    <path
      d="M5 12h.01M12 12h.01M19 12h.01"
      stroke="currentColor"
      strokeWidth="2.5"
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

export const NAV_GROUPS: NavGroup[] = [
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

/** The handful of groups an admin reaches for most often, pinned to the
 * mobile bottom nav; everything else (Sellers/Advertisements/Users) lives
 * behind that bar's "More" sheet. */
export const BOTTOM_NAV_CORE_KEYS = ["overview", "products", "orders", "calls"];
