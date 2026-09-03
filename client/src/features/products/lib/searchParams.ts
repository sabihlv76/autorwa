import type {
  BodyType,
  Condition,
  FilterState,
  FuelType,
  ProductType,
  SortOption,
  TransmissionType,
} from "@/types/product";

export const PAGE_SIZE = 6;

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toNumberOrNull(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const PRODUCT_TYPES: ProductType[] = ["vehicle", "spare_part"];
const CONDITIONS: Condition[] = ["new", "used", "certified_pre_owned"];
const FUEL_TYPES: FuelType[] = ["petrol", "diesel", "hybrid", "electric"];
const TRANSMISSIONS: TransmissionType[] = ["manual", "automatic"];
const BODY_TYPES: BodyType[] = [
  "sedan",
  "suv",
  "hatchback",
  "pickup",
  "van",
  "coupe",
  "wagon",
  "minibus",
];
const SORT_OPTIONS: SortOption[] = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
];

export function parseFilters(searchParams: RawSearchParams): FilterState {
  const type = first(searchParams.type);
  const condition = first(searchParams.condition);
  const fuel = first(searchParams.fuel);
  const transmission = first(searchParams.transmission);
  const bodyType = first(searchParams.bodyType);
  const rentalOption = first(searchParams.rentalOption);

  return {
    type: type && PRODUCT_TYPES.includes(type as ProductType)
      ? (type as ProductType)
      : "all",
    q: first(searchParams.q) ?? "",
    make: first(searchParams.make) ?? "",
    category: first(searchParams.category) ?? "",
    condition:
      condition && CONDITIONS.includes(condition as Condition)
        ? (condition as Condition)
        : "all",
    fuel: fuel && FUEL_TYPES.includes(fuel as FuelType) ? (fuel as FuelType) : "all",
    transmission:
      transmission && TRANSMISSIONS.includes(transmission as TransmissionType)
        ? (transmission as TransmissionType)
        : "all",
    bodyType:
      bodyType && BODY_TYPES.includes(bodyType as BodyType)
        ? (bodyType as BodyType)
        : "all",
    location: first(searchParams.location) ?? "",
    minPrice: toNumberOrNull(first(searchParams.minPrice)),
    maxPrice: toNumberOrNull(first(searchParams.maxPrice)),
    minYear: toNumberOrNull(first(searchParams.minYear)),
    maxYear: toNumberOrNull(first(searchParams.maxYear)),
    maxMileageKm: toNumberOrNull(first(searchParams.maxMileageKm)),
    seller: first(searchParams.seller) ?? "",
    rentalOption:
      rentalOption === "sale" || rentalOption === "rent" ? rentalOption : "all",
  };
}

export function parseSort(searchParams: RawSearchParams): SortOption {
  const sort = first(searchParams.sort);
  return sort && SORT_OPTIONS.includes(sort as SortOption)
    ? (sort as SortOption)
    : "newest";
}

export function parsePage(searchParams: RawSearchParams): number {
  const page = toNumberOrNull(first(searchParams.page));
  return page && page > 0 ? Math.floor(page) : 1;
}

/**
 * Builds a query string from the current raw params with the given
 * overrides applied (null/"" removes the key). Resets `page` to 1
 * unless explicitly overridden, since the result set changes.
 */
export function buildQueryString(
  current: RawSearchParams,
  updates: Record<string, string | number | null>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    const v = first(value);
    if (v) params.set(key, v);
  }

  if (!("page" in updates)) {
    params.delete("page");
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }

  return params.toString();
}
