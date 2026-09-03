import { notFound } from "next/navigation";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { updateAdvertisementAction } from "@/features/admin/actions/updateAdvertisement";
import * as advertisementRepository from "@/repositories/advertisementRepository";

export default async function EditAdvertisementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ad = await advertisementRepository.findById(id);

  if (!ad) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Edit advertisement</h1>
      <AdvertisementForm action={updateAdvertisementAction} ad={ad} />
    </div>
  );
}
