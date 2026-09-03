import { Suspense } from "react";
import { ContactWidget } from "@/components/layout/ContactWidget";
import { Navbar } from "@/components/layout/Navbar";
import { PopularTags } from "@/components/layout/PopularTags";
import { QuickLinks } from "@/components/layout/QuickLinks";
import { readCartOwnerKey } from "@/lib/cart/cartCookie";
import * as cartRepository from "@/repositories/cartRepository";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await readCartOwnerKey();
  const cartItemCount = owner ? await cartRepository.getItemCount(owner) : 0;

  return (
    <>
      <PopularTags />
      <Navbar cartItemCount={cartItemCount} />
      <Suspense fallback={<div className="h-10 border-b border-zinc-200 bg-white" />}>
        <QuickLinks />
      </Suspense>
      <main className="flex-1 bg-zinc-50">{children}</main>
      <ContactWidget />
    </>
  );
}
