export type Currency = "RWF" | "USD";

export type ProductType = "vehicle" | "spare_part";

export type Condition = "new" | "used" | "certified_pre_owned";

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";

export type TransmissionType = "manual" | "automatic";

export type DriveType = "fwd" | "rwd" | "awd" | "4wd";

export type BodyType =
  | "sedan"
  | "suv"
  | "hatchback"
  | "pickup"
  | "van"
  | "coupe"
  | "wagon"
  | "minibus";

export type ListingType = "sale" | "rent" | "both";

export interface Seller {
  id: string;
  name: string;
  verified: boolean;
  location: string;
  whatsapp: string;
  enterprise?: boolean;
  rating?: number;
  createdAt?: string;
}

interface ProductBase {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  images: string[];
  seller: Seller;
  availability: "available" | "reserved" | "sold" | "out_of_stock";
  featured: boolean;
  createdAt: string;
}

export interface Vehicle extends ProductBase {
  type: "vehicle";
  make: string;
  model: string;
  generation?: string;
  trim?: string;
  year: number;
  condition: Condition;
  mileageKm: number;
  fuel: FuelType;
  transmission: TransmissionType;
  driveType: DriveType;
  engineCapacityL: number;
  bodyType: BodyType;
  color: string;
  location: string;
  features: string[];
  negotiable: boolean;
  listingType: ListingType;
  /** Daily rental rate. When listingType is "rent", `price` itself is the
   * daily rate; this field only carries a distinct rate for "both". */
  dailyRentalRate?: number;
  minRentalDays: number;
  maxRentalDays?: number;
}

export interface SparePart extends ProductBase {
  type: "spare_part";
  partName: string;
  partNumber: string;
  category: string;
  brand: string;
  stock: number;
  condition: Condition;
  compatibleMakes: string[];
  compatibleModels: string[];
  compatibleYears: [number, number];
  compatibilityNotes?: string;
  warrantyMonths?: number;
}

export type Product = Vehicle | SparePart;

export type AdPosition = "top_left" | "top_right";

export interface Advertisement {
  id: string;
  position: AdPosition;
  title: string;
  imageUrl: string;
  targetUrl: string;
  advertiser: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  priority: number;
}

export type SortOption =
  | "recommended"
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc";

export type PostedWithin = "all" | "24h" | "7d" | "30d";

export interface FilterState {
  type: ProductType | "all";
  q: string;
  make: string;
  category: string;
  condition: Condition | "all";
  fuel: FuelType | "all";
  transmission: TransmissionType | "all";
  bodyType: BodyType | "all";
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  maxMileageKm: number | null;
  seller: string;
  rentalOption: "all" | "sale" | "rent";
  postedWithin: PostedWithin;
}
