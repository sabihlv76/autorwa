"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CAR_MAKES } from "@/lib/carMakes";

const BODY_TYPES = [
  "sedan",
  "suv",
  "hatchback",
  "pickup",
  "van",
  "coupe",
  "wagon",
  "minibus",
] as const;

const fieldClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black focus:border-accent focus:outline-none sm:w-40";

function tabClass(active: boolean) {
  return `rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
    active ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100"
  }`;
}

export function HeroSearch() {
  const { dictionary } = useLocale();
  const [tab, setTab] = useState<"vehicle" | "spare_part">("vehicle");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-lg sm:p-5">
      <div className="mb-3 flex gap-1">
        <button type="button" onClick={() => setTab("vehicle")} className={tabClass(tab === "vehicle")}>
          {dictionary.home.searchTabCars}
        </button>
        <button
          type="button"
          onClick={() => setTab("spare_part")}
          className={tabClass(tab === "spare_part")}
        >
          {dictionary.home.searchTabParts}
        </button>
      </div>

      <form action="/marketplace" method="get" className="flex flex-col gap-2 sm:flex-row">
        <input type="hidden" name="type" value={tab} />
        <input
          type="text"
          name="q"
          placeholder={dictionary.home.searchKeywordPlaceholder}
          className={`${fieldClass} sm:flex-1`}
        />
        {tab === "vehicle" ? (
          <>
            <select name="make" defaultValue="" className={fieldClass} aria-label={dictionary.filters.make}>
              <option value="">{dictionary.home.searchAnyMake}</option>
              {CAR_MAKES.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              name="bodyType"
              defaultValue=""
              className={fieldClass}
              aria-label={dictionary.filters.bodyType}
            >
              <option value="">{dictionary.home.searchAnyType}</option>
              {BODY_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {dictionary.vehicleType[bt]}
                </option>
              ))}
            </select>
          </>
        ) : (
          <input
            type="text"
            name="category"
            placeholder={dictionary.home.searchCategoryPlaceholder}
            className={fieldClass}
          />
        )}
        <button
          type="submit"
          className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          {tab === "vehicle" ? dictionary.home.searchCta : dictionary.home.searchCtaParts}
        </button>
      </form>
    </div>
  );
}
