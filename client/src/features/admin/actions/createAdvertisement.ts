"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/auth/requireAdmin";
import { advertisementFormSchema } from "@/lib/validation/advertisement";
import * as advertisementRepository from "@/repositories/advertisementRepository";
import * as auditLogRepository from "@/repositories/auditLogRepository";

export interface AdvertisementFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createAdvertisementAction(
  _prevState: AdvertisementFormState,
  formData: FormData,
): Promise<AdvertisementFormState> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  const parsed = advertisementFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const ad = await advertisementRepository.create({
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || "",
  });

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "advertisement.create",
    targetType: "advertisement",
    targetId: ad.id,
    metadata: { title: ad.title, position: ad.position },
  });

  redirect("/ops-console/advertisements");
}
