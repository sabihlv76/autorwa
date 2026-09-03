import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import * as productRepository from "@/repositories/productRepository";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;

  const { items, totalPages } = await productRepository.findManyForAdmin({
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">Products</h1>
        <Link
          href="/ops-console/products/new"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-dark"
        >
          New product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Listing</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Availability</th>
              <th className="px-3 py-2">Seller</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-3 py-2 font-medium text-black">{product.title}</td>
                <td className="px-3 py-2 text-zinc-500">{product.type}</td>
                <td className="px-3 py-2 text-zinc-500">
                  {product.type === "vehicle" ? product.listingType : "—"}
                </td>
                <td className="px-3 py-2 text-zinc-500">
                  {product.currency} {product.price.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-zinc-500">{product.availability}</td>
                <td className="px-3 py-2 text-zinc-500">{product.seller.name}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/ops-console/products/${product.id}/edit`}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/ops-console/products?page=${p}`}
              className={`rounded-md border px-2 py-1 ${
                p === page ? "border-accent bg-accent text-white" : "border-zinc-300 text-black"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
