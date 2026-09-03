"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as productRepository from "@/repositories/productRepository";
import { parseProductForm, type ProductFormState } from "./productForm";

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  const productId = formData.get("productId");
  if (typeof productId !== "string" || !productId) {
    return { success: false, error: "Missing product id." };
  }

  const parsed = parseProductForm(formData);
  if (!parsed.success) return parsed.state;

  const updated = await productRepository.update(productId, parsed.data);
  if (!updated) {
    return { success: false, error: "Product not found." };
  }

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "product.update",
    targetType: "product",
    targetId: productId,
    metadata: { title: updated.title },
  });

  redirect("/ops-console/products");
}
