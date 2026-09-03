"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as productRepository from "@/repositories/productRepository";

export async function deleteProductAction(
  productId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  await productRepository.remove(productId);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "product.delete",
    targetType: "product",
    targetId: productId,
  });

  return { success: true };
}
