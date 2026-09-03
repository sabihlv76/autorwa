import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { createAdvertisementAction } from "@/features/admin/actions/createAdvertisement";

export default function NewAdvertisementPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">New advertisement</h1>
      <AdvertisementForm action={createAdvertisementAction} />
    </div>
  );
}
