import { ProductsAdminClient } from "@/components/admin/ProductsAdminClient";
import * as productRepository from "@/repositories/productRepository";
import * as sellerRepository from "@/repositories/sellerRepository";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;

  const [{ items, totalPages }, sellers] = await Promise.all([
    productRepository.findManyForAdmin({ page, pageSize: PAGE_SIZE }),
    sellerRepository.listAll(),
  ]);

  return <ProductsAdminClient items={items} page={page} totalPages={totalPages} sellers={sellers} />;
}
