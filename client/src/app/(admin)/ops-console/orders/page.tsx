import Link from "next/link";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { updateWhatsAppOrderStatusAction } from "@/features/admin/actions/updateWhatsAppOrderStatus";
import * as whatsappOrderRepository from "@/repositories/whatsappOrderRepository";
import { WHATSAPP_ORDER_STATUSES } from "@/repositories/whatsappOrderRepository";
import type { WhatsAppOrderStatus } from "@/repositories/whatsappOrderRepository";

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;
  const status = WHATSAPP_ORDER_STATUSES.includes(resolved.status as WhatsAppOrderStatus)
    ? (resolved.status as WhatsAppOrderStatus)
    : undefined;

  const { items, totalPages } = await whatsappOrderRepository.findMany({
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">WhatsApp orders</h1>

      <div className="mb-4 flex gap-2 text-xs">
        <Link
          href="/ops-console/orders"
          className={`rounded-md border px-2 py-1 ${!status ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
        >
          All
        </Link>
        {WHATSAPP_ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/ops-console/orders?status=${s}`}
            className={`rounded-md border px-2 py-1 ${status === s ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Reference</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Seller</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-3 py-2 font-mono text-xs text-black">{order.orderReference}</td>
                <td className="px-3 py-2 text-zinc-500">
                  {order.customerName} · {order.customerPhone}
                </td>
                <td className="px-3 py-2 text-zinc-500">{order.sellerName}</td>
                <td className="px-3 py-2 text-zinc-500">{order.itemCount}</td>
                <td className="px-3 py-2 text-zinc-500">
                  {order.currency} {order.totalAmount.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-zinc-500">{order.createdAt.slice(0, 10)}</td>
                <td className="px-3 py-2">
                  <StatusUpdateForm
                    id={order.id}
                    currentStatus={order.status}
                    statusOptions={WHATSAPP_ORDER_STATUSES}
                    onUpdate={updateWhatsAppOrderStatusAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/ops-console/orders?page=${p}${status ? `&status=${status}` : ""}`}
              className={`rounded-md border px-2 py-1 ${
                p === page ? "border-accent bg-accent text-white" : "border-zinc-300 text-black"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
