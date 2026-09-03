import { BookCallForm } from "@/components/callBooking/BookCallForm";
import { auth } from "@/lib/auth/auth";
import * as productRepository from "@/repositories/productRepository";

export default async function BookCallPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const productId = Array.isArray(resolved.productId)
    ? resolved.productId[0]
    : resolved.productId;

  const [product, session] = await Promise.all([
    productId ? productRepository.findByIds([productId]).then((r) => r[0] ?? null) : null,
    auth(),
  ]);

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-md border border-zinc-200 bg-white p-6">
        <BookCallForm
          productId={product?.id}
          productTitle={product?.title}
          defaultName={session?.user?.name ?? undefined}
        />
      </div>
    </div>
  );
}
