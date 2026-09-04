"use client";

import { signOut } from "next-auth/react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SignOutButton() {
  const { dictionary } = useLocale();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-black hover:bg-zinc-50"
    >
      {dictionary.auth.signOut}
    </button>
  );
}
