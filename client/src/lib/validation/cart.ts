import { z } from "zod";
import { phoneSchema } from "./common";

export const quantitySchema = z.coerce.number().int().min(0).max(999);

export const confirmOrderSchema = z.object({
  sellerId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  phone: phoneSchema,
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ConfirmOrderInput = z.infer<typeof confirmOrderSchema>;
