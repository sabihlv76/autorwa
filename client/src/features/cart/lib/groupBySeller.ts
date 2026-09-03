import type { RehydratedCartItem, SellerOrderGroup } from "@/types/cart";

export function groupBySeller(items: RehydratedCartItem[]): SellerOrderGroup[] {
  const groups = new Map<string, SellerOrderGroup>();

  for (const item of items) {
    if (!item.product) continue;
    const { seller } = item.product;

    let group = groups.get(seller.id);
    if (!group) {
      group = {
        sellerId: seller.id,
        sellerName: seller.name,
        sellerWhatsapp: seller.whatsapp,
        items: [],
        hasIssues: false,
      };
      groups.set(seller.id, group);
    }

    group.items.push(item);
    if (item.unavailable || item.priceChanged) group.hasIssues = true;
  }

  return Array.from(groups.values());
}
