"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent">
      <path
        d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1.3-3.6A7.96 7.96 0 0 1 4 12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarKeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M4 9.5h16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10.5" cy="14.5" r="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12.2 14.5H16M14.5 14.5V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ValueCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-black">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
    </div>
  );
}

export function ValueProps() {
  const { dictionary } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ValueCard
          icon={<ShieldCheckIcon />}
          title={dictionary.home.valueProp1Title}
          description={dictionary.home.valueProp1Desc}
        />
        <ValueCard
          icon={<ChatIcon />}
          title={dictionary.home.valueProp2Title}
          description={dictionary.home.valueProp2Desc}
        />
        <ValueCard
          icon={<CalendarKeyIcon />}
          title={dictionary.home.valueProp3Title}
          description={dictionary.home.valueProp3Desc}
        />
      </div>
    </section>
  );
}
