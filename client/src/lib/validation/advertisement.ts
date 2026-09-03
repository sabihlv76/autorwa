import { z } from "zod";

const optionalDate = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? new Date(v) : undefined));

export const advertisementFormSchema = z.object({
  position: z.enum(["top_left", "top_right"]),
  title: z.string().trim().min(3).max(200),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  targetUrl: z.string().trim().min(1),
  advertiser: z.string().trim().min(1).max(150),
  active: z.preprocess((v) => v === "on", z.boolean()),
  startDate: optionalDate,
  endDate: optionalDate,
  priority: z.coerce.number().int().min(0).max(100).default(0),
});

export type AdvertisementFormInput = z.infer<typeof advertisementFormSchema>;
