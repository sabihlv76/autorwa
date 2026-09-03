"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function MarketplaceIntro() {
  const { dictionary } = useLocale();

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight text-black">
        {dictionary.common.browseTitle}
      </h1>
    </div>
  );
}
