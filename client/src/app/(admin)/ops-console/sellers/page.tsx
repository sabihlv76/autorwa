import { SellersAdminClient } from "@/components/admin/SellersAdminClient";
import * as sellerRepository from "@/repositories/sellerRepository";

export default async function AdminSellersPage() {
  const sellers = await sellerRepository.listAll();

  return <SellersAdminClient sellers={sellers} />;
}
