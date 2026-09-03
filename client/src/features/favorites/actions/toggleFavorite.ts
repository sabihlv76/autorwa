"use server";

import { auth } from "@/lib/auth/auth";
import * as favoriteRepository from "@/repositories/favoriteRepository";

export interface ToggleFavoriteResult {
  success: boolean;
  requiresAuth?: boolean;
  favorited?: boolean;
}

export async function toggleFavoriteAction(productId: string): Promise<ToggleFavoriteResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, requiresAuth: true };
  }

  const userId = session.user.id;
  const alreadyFavorited = await favoriteRepository.isFavorited(userId, productId);

  if (alreadyFavorited) {
    await favoriteRepository.remove(userId, productId);
    return { success: true, favorited: false };
  }

  await favoriteRepository.add(userId, productId);
  return { success: true, favorited: true };
}
