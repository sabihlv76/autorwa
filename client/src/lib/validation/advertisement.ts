import { z } from "zod";

// Autorwa targets Rwanda (Africa/Kigali, UTC+2 year-round, no DST). The
// admin's date picker sends a bare "YYYY-MM-DD" — the JS Date constructor
// parses that as UTC midnight, not Kigali midnight, which put every ad's
// start/end ~2 hours later than the admin actually meant (an ad "starting
// today" wasn't live until 2am UTC, i.e. the last stretch of "today" in
// Kigali). Anchoring explicitly to +02:00 makes the picker match what an
// admin in Kigali actually sees on the calendar.
const KIGALI_UTC_OFFSET = "+02:00";

const startOfDay = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? new Date(`${v}T00:00:00${KIGALI_UTC_OFFSET}`) : undefined));

// endDate uses end-of-day, not start-of-day — otherwise an ad "ending" on a
// given date would expire at the very first instant of that date instead
// of running through the whole day.
const endOfDay = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? new Date(`${v}T23:59:59.999${KIGALI_UTC_OFFSET}`) : undefined));

export const advertisementFormSchema = z.object({
  position: z.enum(["top_left", "top_right"]),
  title: z.string().trim().min(3).max(200),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  // A bare domain like "example.com" (no scheme) would render as a broken
  // relative link on the storefront (`/example.com`) instead of navigating
  // off-site — assume https:// when the admin leaves the scheme off. Paths
  // starting with "/" are left alone since ads can also link internally
  // (e.g. "/book-call").
  targetUrl: z
    .string()
    .trim()
    .min(1)
    .transform((v) => (/^https?:\/\//i.test(v) || v.startsWith("/") ? v : `https://${v}`)),
  advertiser: z.string().trim().min(1).max(150),
  active: z.preprocess((v) => v === "on", z.boolean()),
  startDate: startOfDay,
  endDate: endOfDay,
  priority: z.coerce.number().int().min(0).max(100).default(0),
});

export type AdvertisementFormInput = z.infer<typeof advertisementFormSchema>;
