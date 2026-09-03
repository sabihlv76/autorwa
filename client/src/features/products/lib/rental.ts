import type { Vehicle } from "@/types/product";

export function isRentable(vehicle: Vehicle): boolean {
  return vehicle.listingType === "rent" || vehicle.listingType === "both";
}

export function isSellable(vehicle: Vehicle): boolean {
  return vehicle.listingType === "sale" || vehicle.listingType === "both";
}

/** `price` is the daily rate when rent-only; `dailyRentalRate` only carries
 * a distinct value when a vehicle is both for sale and for rent. */
export function getDailyRate(vehicle: Vehicle): number {
  if (vehicle.listingType === "both") {
    return vehicle.dailyRentalRate ?? vehicle.price;
  }
  return vehicle.price;
}

export function computeRentalDays(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((endDate.getTime() - startDate.getTime()) / msPerDay);
}
