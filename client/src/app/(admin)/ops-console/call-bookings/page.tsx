import Link from "next/link";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { updateCallBookingStatusAction } from "@/features/admin/actions/updateCallBookingStatus";
import * as callBookingRepository from "@/repositories/callBookingRepository";
import { CALL_BOOKING_STATUSES } from "@/repositories/callBookingRepository";
import type { CallBookingStatus } from "@/repositories/callBookingRepository";

const PAGE_SIZE = 20;

export default async function AdminCallBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;
  const status = CALL_BOOKING_STATUSES.includes(resolved.status as CallBookingStatus)
    ? (resolved.status as CallBookingStatus)
    : undefined;

  const { items, totalPages } = await callBookingRepository.findMany({
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Call bookings</h1>

      <div className="mb-4 flex gap-2 text-xs">
        <Link
          href="/ops-console/call-bookings"
          className={`rounded-md border px-2 py-1 ${!status ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
        >
          All
        </Link>
        {CALL_BOOKING_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/ops-console/call-bookings?status=${s}`}
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
              <th className="px-3 py-2">Preferred</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((booking) => (
              <tr key={booking.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-3 py-2 font-mono text-xs text-black">
                  {booking.bookingReference}
                </td>
                <td className="px-3 py-2 text-zinc-500">
                  {booking.customerName} · {booking.phone}
                </td>
                <td className="px-3 py-2 text-zinc-500">
                  {booking.preferredDate} {booking.preferredTime}
                </td>
                <td className="px-3 py-2 max-w-xs truncate text-zinc-500">{booking.reason}</td>
                <td className="px-3 py-2 text-zinc-500">{booking.productTitle ?? "—"}</td>
                <td className="px-3 py-2">
                  <StatusUpdateForm
                    id={booking.id}
                    currentStatus={booking.status}
                    statusOptions={CALL_BOOKING_STATUSES}
                    onUpdate={updateCallBookingStatusAction}
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
              href={`/ops-console/call-bookings?page=${p}${status ? `&status=${status}` : ""}`}
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
