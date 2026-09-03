import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/marketplace/ProductDetailView";
import { auth } from "@/lib/auth/auth";
import * as favoriteRepository from "@/repositories/favoriteRepository";
import * as productRepository from "@/repositories/productRepository";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.title} — Autorwa`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await productRepository.findRelated(product, 4);

  const session = await auth();
  let isFavorited = false;
  let favoritedRelatedIds: Set<string> | undefined;

  if (session?.user?.id) {
    const allIds = [product.id, ...relatedProducts.map((p) => p.id)];
    const favoritedIds = await favoriteRepository.listProductIdsForUser(
      session.user.id,
      allIds,
    );
    isFavorited = favoritedIds.has(product.id);
    favoritedRelatedIds = favoritedIds;
  }

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited}
      favoritedRelatedIds={favoritedRelatedIds}
    />
  );
}
