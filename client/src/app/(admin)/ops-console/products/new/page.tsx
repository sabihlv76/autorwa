import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/features/admin/actions/createProduct";
import * as sellerRepository from "@/repositories/sellerRepository";

export default async function NewProductPage() {
  const sellers = await sellerRepository.listAll();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">New product</h1>
      <ProductForm action={createProductAction} sellers={sellers} />
    </div>
  );
}
