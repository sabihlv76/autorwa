import { z } from "zod";
import { phoneSchema } from "./common";

const BUSINESS_HOURS_START_MINUTES = 8 * 60; // 08:00
const BUSINESS_HOURS_END_MINUTES = 20 * 60; // 20:00

function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

export const callBookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: phoneSchema,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
    .refine((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }, "Preferred date can't be in the past"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid time")
    .refine((value) => {
      const minutes = toMinutes(value);
      return minutes >= BUSINESS_HOURS_START_MINUTES && minutes <= BUSINESS_HOURS_END_MINUTES;
    }, "Please choose a time between 08:00 and 20:00"),
  reason: z.string().trim().min(3).max(500),
  productId: z.string().optional().or(z.literal("")),
});

export type CallBookingInput = z.infer<typeof callBookingSchema>;
