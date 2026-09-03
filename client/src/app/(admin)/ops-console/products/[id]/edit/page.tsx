import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/features/admin/actions/updateProduct";
import * as productRepository from "@/repositories/productRepository";
import * as sellerRepository from "@/repositories/sellerRepository";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, sellers] = await Promise.all([
    productRepository.findByIds([id]).then((r) => r[0] ?? null),
    sellerRepository.listAll(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Edit product</h1>
      <ProductForm action={updateProductAction} sellers={sellers} product={product} />
    </div>
  );
}
