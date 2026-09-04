import mongoose, { type SortOrder } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { ProductModel, SparePartProductModel, VehicleProductModel } from "@/models/Product";
import * as sellerRepository from "@/repositories/sellerRepository";
import type { PaginatedResult } from "@/features/products/lib/paginate";
import type {
  BodyType,
  Condition,
  Currency,
  DriveType,
  FilterState,
  FuelType,
  ListingType,
  Product,
  Seller,
  SortOption,
  TransmissionType,
} from "@/types/product";

interface ProductDocBase {
  _id: { toString(): string };
  type: "vehicle" | "spare_part";
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  images: string[];
  seller: Seller;
  availability: Product["availability"];
  condition: Condition;
  featured: boolean;
  createdAt: Date;
}

interface VehicleDoc extends ProductDocBase {
  type: "vehicle";
  make: string;
  model: string;
  generation?: string;
  trim?: string;
  year: number;
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
  dailyRentalRate?: number;
  minRentalDays: number;
  maxRentalDays?: number;
}

interface SparePartDoc extends ProductDocBase {
  type: "spare_part";
  partName: string;
  partNumber: string;
  category: string;
  brand: string;
  stock: number;
  compatibleMakes: string[];
  compatibleModels: string[];
  compatibleYears: [number, number];
  compatibilityNotes?: string;
  warrantyMonths?: number;
}

type ProductDoc = VehicleDoc | SparePartDoc;

function toProduct(doc: ProductDoc): Product {
  const base = {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    price: doc.price,
    currency: doc.currency,
    images: doc.images ?? [],
    seller: doc.seller,
    availability: doc.availability,
    featured: doc.featured,
    createdAt: new Date(doc.createdAt).toISOString(),
  };

  if (doc.type === "vehicle") {
    return {
      ...base,
      type: "vehicle",
      make: doc.make,
      model: doc.model,
      generation: doc.generation,
      trim: doc.trim,
      year: doc.year,
      condition: doc.condition,
      mileageKm: doc.mileageKm,
      fuel: doc.fuel,
      transmission: doc.transmission,
      driveType: doc.driveType,
      engineCapacityL: doc.engineCapacityL,
      bodyType: doc.bodyType,
      color: doc.color,
      location: doc.location,
      features: doc.features ?? [],
      negotiable: doc.negotiable ?? false,
      listingType: doc.listingType ?? "sale",
      dailyRentalRate: doc.dailyRentalRate,
      minRentalDays: doc.minRentalDays ?? 1,
      maxRentalDays: doc.maxRentalDays,
    };
  }

  return {
    ...base,
    type: "spare_part",
    partName: doc.partName,
    partNumber: doc.partNumber,
    category: doc.category,
    brand: doc.brand,
    stock: doc.stock,
    condition: doc.condition,
    compatibleMakes: doc.compatibleMakes ?? [],
    compatibleModels: doc.compatibleModels ?? [],
    compatibleYears: doc.compatibleYears,
    compatibilityNotes: doc.compatibilityNotes,
    warrantyMonths: doc.warrantyMonths,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Mongoose 9 no longer publicly exports a FilterQuery-style helper type, so
// this is built up as a loosely-typed Mongo query document instead.
type MongoFilter = Record<string, unknown>;

function buildFilterQuery(filters: FilterState): MongoFilter {
  const query: MongoFilter = {};
  const and: MongoFilter[] = [];

  if (filters.type !== "all") {
    query.type = filters.type;
  }

  if (filters.q) {
    query.title = { $regex: escapeRegex(filters.q), $options: "i" };
  }

  if (filters.make) {
    const makeRegex = new RegExp(`^${escapeRegex(filters.make)}$`, "i");
    and.push({ $or: [{ make: makeRegex }, { brand: makeRegex }] });
  }

  if (filters.category) {
    const categoryRegex = new RegExp(`^${escapeRegex(filters.category)}$`, "i");
    and.push({ $or: [{ type: "vehicle" }, { category: categoryRegex }] });
  }

  if (filters.condition !== "all") {
    query.condition = filters.condition;
  }

  if (filters.fuel !== "all") {
    query.fuel = filters.fuel;
  }

  if (filters.transmission !== "all") {
    query.transmission = filters.transmission;
  }

  if (filters.bodyType !== "all") {
    query.bodyType = filters.bodyType;
  }

  if (filters.rentalOption === "rent") {
    query.listingType = { $in: ["rent", "both"] };
  } else if (filters.rentalOption === "sale") {
    query.listingType = { $in: ["sale", "both"] };
  }

  if (filters.location) {
    const locationRegex = new RegExp(escapeRegex(filters.location), "i");
    and.push({
      $or: [{ location: locationRegex }, { "seller.location": locationRegex }],
    });
  }

  if (filters.seller && mongoose.isValidObjectId(filters.seller)) {
    query.sellerId = new mongoose.Types.ObjectId(filters.seller);
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const range: Record<string, number> = {};
    if (filters.minPrice !== null) range.$gte = filters.minPrice;
    if (filters.maxPrice !== null) range.$lte = filters.maxPrice;
    query.price = range;
  }

  if (filters.minYear !== null || filters.maxYear !== null) {
    const range: Record<string, number> = {};
    if (filters.minYear !== null) range.$gte = filters.minYear;
    if (filters.maxYear !== null) range.$lte = filters.maxYear;
    query.year = range;
  }

  if (filters.maxMileageKm !== null) {
    query.mileageKm = { $lte: filters.maxMileageKm };
  }

  if (filters.postedWithin !== "all") {
    const hoursByWindow: Record<Exclude<FilterState["postedWithin"], "all">, number> = {
      "24h": 24,
      "7d": 24 * 7,
      "30d": 24 * 30,
    };
    const cutoff = new Date(Date.now() - hoursByWindow[filters.postedWithin] * 60 * 60 * 1000);
    query.createdAt = { $gte: cutoff };
  }

  if (and.length > 0) {
    query.$and = and;
  }

  return query;
}

function buildSort(sort: SortOption): Record<string, SortOrder> {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "newest":
      return { createdAt: -1 };
    case "recommended":
    default:
      return { featured: -1, createdAt: -1 };
  }
}

export async function findMany({
  filters,
  sort,
  page,
  pageSize,
}: {
  filters: FilterState;
  sort: SortOption;
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<Product>> {
  await connectToDatabase();

  const query = buildFilterQuery(filters);
  const totalItems = await ProductModel.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const docs = await ProductModel.find(query)
    .sort(buildSort(sort))
    .skip(skip)
    .limit(pageSize)
    .lean<ProductDoc[]>();

  return {
    items: docs.map(toProduct),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}

export async function findBySlug(slug: string): Promise<Product | null> {
  await connectToDatabase();
  const doc = await ProductModel.findOne({ slug }).lean<ProductDoc | null>();
  return doc ? toProduct(doc) : null;
}

export async function findByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  await connectToDatabase();
  const objectIds = ids
    .filter((id) => mongoose.isValidObjectId(id))
    .map((id) => new mongoose.Types.ObjectId(id));
  const docs = await ProductModel.find({ _id: { $in: objectIds } }).lean<ProductDoc[]>();
  return docs.map(toProduct);
}

export async function findRelated(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  await connectToDatabase();

  const makeOrBrand =
    product.type === "vehicle" ? product.make : product.brand;

  const sameTypeExcludingSelf: MongoFilter = {
    _id: { $ne: new mongoose.Types.ObjectId(product.id) },
    type: product.type,
  };

  const sameMakeOrBrand = await ProductModel.find({
    ...sameTypeExcludingSelf,
    $or: [{ make: makeOrBrand }, { brand: makeOrBrand }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ProductDoc[]>();

  if (sameMakeOrBrand.length >= limit) {
    return sameMakeOrBrand.map(toProduct);
  }

  // Backfill with other same-type products if there weren't enough
  // same-make/brand matches.
  const excludeIds = [product.id, ...sameMakeOrBrand.map((d) => d._id.toString())].map(
    (id) => new mongoose.Types.ObjectId(id),
  );
  const fallback = await ProductModel.find({
    type: product.type,
    _id: { $nin: excludeIds },
  })
    .sort({ createdAt: -1 })
    .limit(limit - sameMakeOrBrand.length)
    .lean<ProductDoc[]>();

  return [...sameMakeOrBrand, ...fallback].map(toProduct);
}

interface AdminProductFieldsBase {
  title: string;
  description: string;
  price: number;
  currency: Currency;
  images: string[];
  sellerId: string;
  availability: Product["availability"];
  featured: boolean;
  condition: Condition;
}

export interface AdminVehicleInput extends AdminProductFieldsBase {
  type: "vehicle";
  make: string;
  model: string;
  generation?: string;
  trim?: string;
  year: number;
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
  dailyRentalRate?: number;
  minRentalDays: number;
  maxRentalDays?: number;
}

export interface AdminSparePartInput extends AdminProductFieldsBase {
  type: "spare_part";
  partName: string;
  partNumber: string;
  category: string;
  brand: string;
  stock: number;
  compatibleMakes: string[];
  compatibleModels: string[];
  compatibleYears?: [number, number];
  compatibilityNotes?: string;
  warrantyMonths?: number;
}

export type AdminProductInput = AdminVehicleInput | AdminSparePartInput;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(title: string): Promise<string> {
  await connectToDatabase();
  const base = slugify(title) || "product";
  let slug = base;
  let attempt = 0;
  while (await ProductModel.exists({ slug })) {
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
  return slug;
}

export async function create(input: AdminProductInput): Promise<Product> {
  await connectToDatabase();

  const seller = await sellerRepository.findById(input.sellerId);
  if (!seller) throw new Error(`Seller ${input.sellerId} not found`);

  const slug = await generateUniqueSlug(input.title);
  const { type, sellerId, ...rest } = input;
  const doc = {
    ...rest,
    slug,
    sellerId,
    seller,
  };

  const created =
    type === "vehicle"
      ? await VehicleProductModel.create(doc)
      : await SparePartProductModel.create(doc);

  return toProduct(created.toObject() as unknown as ProductDoc);
}

export async function update(
  id: string,
  input: AdminProductInput,
): Promise<Product | null> {
  await connectToDatabase();

  const seller = await sellerRepository.findById(input.sellerId);
  if (!seller) throw new Error(`Seller ${input.sellerId} not found`);

  const { sellerId, ...rest } = input;
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { ...rest, sellerId, seller } },
    { new: true, runValidators: true },
  ).lean<ProductDoc | null>();

  return updated ? toProduct(updated) : null;
}

export async function remove(id: string): Promise<void> {
  await connectToDatabase();
  await ProductModel.findByIdAndDelete(id);
}

export async function countByType(): Promise<{ vehicle: number; spare_part: number }> {
  await connectToDatabase();
  const [vehicle, spare_part] = await Promise.all([
    ProductModel.countDocuments({ type: "vehicle" }),
    ProductModel.countDocuments({ type: "spare_part" }),
  ]);
  return { vehicle, spare_part };
}

/** Available-vehicle counts grouped by `make`, for the homepage "Search by Make" cards. */
export async function countVehiclesByMake(): Promise<Record<string, number>> {
  await connectToDatabase();
  const rows = await ProductModel.aggregate<{ _id: string; count: number }>([
    { $match: { type: "vehicle", availability: "available" } },
    { $group: { _id: "$make", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [r._id, r.count]));
}

/** Available-vehicle counts grouped by `bodyType`, for the homepage "Search by Type" cards. */
export async function countVehiclesByBodyType(): Promise<Record<string, number>> {
  await connectToDatabase();
  const rows = await ProductModel.aggregate<{ _id: string; count: number }>([
    { $match: { type: "vehicle", availability: "available" } },
    { $group: { _id: "$bodyType", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [r._id, r.count]));
}

/** Available vehicles for homepage discovery rails (Featured / Latest Arrivals). */
export async function findVehicles({
  featured,
  limit,
}: {
  featured?: boolean;
  limit: number;
}): Promise<Product[]> {
  await connectToDatabase();
  const query: MongoFilter = { type: "vehicle", availability: "available" };
  if (featured) query.featured = true;

  const docs = await ProductModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ProductDoc[]>();

  return docs.map(toProduct);
}

export async function findManyForAdmin({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<Product>> {
  await connectToDatabase();
  const totalItems = await ProductModel.countDocuments();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const docs = await ProductModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean<ProductDoc[]>();

  return {
    items: docs.map(toProduct),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
