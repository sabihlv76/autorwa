import { sparePartFormSchema, vehicleFormSchema } from "@/lib/validation/product";
import type { AdminProductInput } from "@/repositories/productRepository";
import type { z } from "zod";

export interface ProductFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Shared FormData -> validated AdminProductInput parsing, used by both the
 * create and update Server Actions so the two field sets stay in sync. */
export function parseProductForm(
  formData: FormData,
): { success: true; data: AdminProductInput } | { success: false; state: ProductFormState } {
  const type = formData.get("type");
  const raw = Object.fromEntries(formData.entries());

  if (type === "vehicle") {
    const parsed = vehicleFormSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, state: fieldErrorsFrom(parsed) };
    }
    const { generation, trim, dailyRentalRate, maxRentalDays, ...rest } = parsed.data;
    return {
      success: true,
      data: {
        ...rest,
        generation: generation || undefined,
        trim: trim || undefined,
        dailyRentalRate,
        maxRentalDays,
      },
    };
  }

  if (type === "spare_part") {
    const parsed = sparePartFormSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, state: fieldErrorsFrom(parsed) };
    }
    const { compatibleYearFrom, compatibleYearTo, compatibilityNotes, ...rest } = parsed.data;
    return {
      success: true,
      data: {
        ...rest,
        compatibleYears:
          compatibleYearFrom !== undefined && compatibleYearTo !== undefined
            ? [compatibleYearFrom, compatibleYearTo]
            : undefined,
        compatibilityNotes: compatibilityNotes || undefined,
      },
    };
  }

  return {
    success: false,
    state: { success: false, error: "Choose a product type." },
  };
}

function fieldErrorsFrom(parsed: {
  success: false;
  error: z.ZodError;
}): { success: false; state: ProductFormState } {
  return {
    success: false,
    state: { success: false, fieldErrors: parsed.error.flatten().fieldErrors },
  };
}
