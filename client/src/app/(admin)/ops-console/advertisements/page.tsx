import { AdvertisementsAdminClient } from "@/components/admin/AdvertisementsAdminClient";
import * as advertisementRepository from "@/repositories/advertisementRepository";

export default async function AdminAdvertisementsPage() {
  const ads = await advertisementRepository.listAll();

  return <AdvertisementsAdminClient ads={ads} />;
}
