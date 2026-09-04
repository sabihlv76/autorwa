"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as productRepository from "@/repositories/productRepository";
import { parseProductForm, type ProductFormState } from "./productForm";

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  const parsed = parseProductForm(formData);
  if (!parsed.success) return parsed.state;

  const product = await productRepository.create(parsed.data);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "product.create",
    targetType: "product",
    targetId: product.id,
    metadata: { title: product.title, type: product.type },
  });

  return { success: true };
}
