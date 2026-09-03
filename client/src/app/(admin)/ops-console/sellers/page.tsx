import { CreateSellerForm } from "@/components/admin/CreateSellerForm";
import * as sellerRepository from "@/repositories/sellerRepository";

export default async function AdminSellersPage() {
  const sellers = await sellerRepository.listAll();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Sellers</h1>

      <div className="mb-6 overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Verified</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-3 py-2 font-medium text-black">{seller.name}</td>
                <td className="px-3 py-2 text-zinc-500">{seller.location}</td>
                <td className="px-3 py-2 text-zinc-500">{seller.whatsapp}</td>
                <td className="px-3 py-2 text-zinc-500">{seller.verified ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateSellerForm />
    </div>
  );
}
