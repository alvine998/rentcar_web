import type { Metadata } from "next";
import { BookingsTable } from "@/components/admin/bookings-table";
import { BOOKINGS } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Booking Management" };

export default function BookingsAdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="label text-accent">Operations</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Bookings</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Incoming booking requests from the website. Update a status from the
        dropdown as the trip progresses.
      </p>
      <div className="mt-8">
        <BookingsTable bookings={BOOKINGS} />
      </div>
    </div>
  );
}
