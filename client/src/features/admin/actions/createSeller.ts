"use server";

import { z } from "zod";
import { requireAdminAction } from "@/lib/auth/requireAdmin";
import { phoneSchema } from "@/lib/validation/common";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as sellerRepository from "@/repositories/sellerRepository";

const createSellerSchema = z.object({
  name: z.string().trim().min(2).max(150),
  location: z.string().trim().min(2).max(150),
  whatsapp: phoneSchema,
  verified: z.preprocess((v) => v === "on", z.boolean()),
  enterprise: z.preprocess((v) => v === "on", z.boolean()),
  rating: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.number().min(1).max(5).optional(),
  ),
});

export interface CreateSellerState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createSellerAction(
  _prevState: CreateSellerState,
  formData: FormData,
): Promise<CreateSellerState> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  const parsed = createSellerSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location"),
    whatsapp: formData.get("whatsapp"),
    verified: formData.get("verified"),
    enterprise: formData.get("enterprise"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const seller = await sellerRepository.create(parsed.data);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "seller.create",
    targetType: "seller",
    targetId: seller.id,
    metadata: { name: seller.name },
  });

  return { success: true };
}
