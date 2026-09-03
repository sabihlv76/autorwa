"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/auth/requireAdmin";
import { advertisementFormSchema } from "@/lib/validation/advertisement";
import * as advertisementRepository from "@/repositories/advertisementRepository";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import type { AdvertisementFormState } from "./createAdvertisement";

export async function updateAdvertisementAction(
  _prevState: AdvertisementFormState,
  formData: FormData,
): Promise<AdvertisementFormState> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  const adId = formData.get("adId");
  if (typeof adId !== "string" || !adId) {
    return { success: false, error: "Missing advertisement id." };
  }

  const parsed = advertisementFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const updated = await advertisementRepository.update(adId, {
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || "",
  });
  if (!updated) {
    return { success: false, error: "Advertisement not found." };
  }

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "advertisement.update",
    targetType: "advertisement",
    targetId: adId,
    metadata: { title: updated.title },
  });

  redirect("/ops-console/advertisements");
}
