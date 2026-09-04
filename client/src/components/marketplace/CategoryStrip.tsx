"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { BodyType } from "@/types/product";

const BODY_TYPES: BodyType[] = [
  "sedan",
  "suv",
  "hatchback",
  "pickup",
  "van",
  "coupe",
  "wagon",
  "minibus",
];

function WheelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 4v5.5M12 14.5V20M4 12h5.5M14.5 12H20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CarBodyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4 16v-3.5l2-4.5h12l2 4.5V16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12h11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="16" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16.5" cy="16" r="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function SeatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M8 5h4a2 2 0 0 1 2 2v6h-6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 13v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EngineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 5v1.8M12 17.2V19M19 12h-1.8M6.8 12H5M17 7l-1.3 1.3M8.3 15.7 7 17M17 17l-1.3-1.3M8.3 8.3 7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeadlightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M9 7h4l4 5-4 5H9a5 5 0 0 1 0-10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M15 10h4M15 14h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CarCareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3.5c2 2.4 3.5 4.7 3.5 6.8a3.5 3.5 0 1 1-7 0c0-2.1 1.5-4.4 3.5-6.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 17.5l1-1.2M18 17.5l-1-1.2M12 15.5v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SteeringIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 5.5v5M6.4 15.7l4-2.2M17.6 15.7l-4-2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// The requested pill labels don't line up one-to-one with the free-text
// spare-part categories actually in use (Brakes/Electrical/Engine/
// Suspension/"Body & Lighting") — map to a real category where a
// reasonable match exists, and leave the rest unfiltered by category
// (still scoped to spare parts) rather than link to a guaranteed-empty
// result set.
const SPARE_PART_PILLS: {
  label: string;
  category?: string;
  Icon: ComponentType;
}[] = [
  { label: "Wheels & Parts", Icon: WheelIcon },
  { label: "Exterior Accessories", Icon: CarBodyIcon },
  { label: "Interior Accessories", Icon: SeatIcon },
  { label: "Engine & Drivetrain", category: "Engine", Icon: EngineIcon },
  { label: "Headlights & Lighting", category: "Body & Lighting", Icon: HeadlightIcon },
  { label: "Car Care", Icon: CarCareIcon },
  { label: "Brakes, Suspension & Steering", category: "Brakes", Icon: SteeringIcon },
];

function Pill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-green-600 hover:text-green-700"
      }`}
    >
      {label}
    </Link>
  );
}

function IconPill({
  href,
  label,
  active,
  Icon,
}: {
  href: string;
  label: string;
  active: boolean;
  Icon: ComponentType;
}) {
  return (
    <Link
      href={href}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-green-600 hover:text-green-700"
      }`}
    >
      <Icon />
      {label}
    </Link>
  );
}

export function CategoryStrip({
  type,
  activeCategory = "",
  activeBodyType = "",
}: {
  type: "vehicle" | "spare_part";
  activeCategory?: string;
  activeBodyType?: string;
}) {
  const { dictionary } = useLocale();

  if (type === "spare_part") {
    return (
      <div className="mb-4 flex gap-2.5 overflow-x-auto pb-1">
        {SPARE_PART_PILLS.map(({ label, category, Icon }) => (
          <IconPill
            key={label}
            href={
              category
                ? `/marketplace?type=spare_part&category=${encodeURIComponent(category)}`
                : "/marketplace?type=spare_part"
            }
            label={label}
            active={category ? activeCategory === category : false}
            Icon={Icon}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {BODY_TYPES.map((bodyType) => (
        <Pill
          key={bodyType}
          href={`/marketplace?type=vehicle&bodyType=${bodyType}`}
          label={dictionary.vehicleType[bodyType]}
          active={activeBodyType === bodyType}
        />
      ))}
    </div>
  );
}
