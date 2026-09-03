import type { Advertisement } from "@/types/product";

// Seed fixtures for scripts/seed.ts. These two slots promote Autorwa's own
// "we publish for you" listing service (there's no business self-registration
// yet), linking to the call-booking flow as a request-to-be-listed contact
// point rather than inventing a separate contact mechanism.
export const mockAdvertisements: Advertisement[] = [
  {
    id: "ad-top-left-1",
    position: "top_left",
    title: "Have a car to sell or rent? We list it for you.",
    imageUrl: "",
    targetUrl: "/book-call",
    advertiser: "Autorwa",
    active: true,
    priority: 0,
  },
  {
    id: "ad-top-right-1",
    position: "top_right",
    title: "Selling spare parts? Reach buyers across Rwanda.",
    imageUrl: "",
    targetUrl: "/book-call",
    advertiser: "Autorwa",
    active: true,
    priority: 0,
  },
];

export function getAdvertisementForPosition(
  position: Advertisement["position"],
): Advertisement | undefined {
  return mockAdvertisements.find(
    (ad) => ad.position === position && ad.active,
  );
}
