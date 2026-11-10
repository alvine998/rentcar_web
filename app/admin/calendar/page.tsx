import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { BookingsCalendar } from "@/components/admin/bookings-calendar";
import { BOOKINGS } from "@/lib/admin-data";
import { HOLIDAYS } from "@/lib/data";

export const metadata: Metadata = { title: "Calendar" };

async function CalendarView() {
  await connection();
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <BookingsCalendar
      bookings={BOOKINGS}
      holidays={HOLIDAYS}
      todayISO={todayISO}
    />
  );
}

export default function CalendarAdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="label text-accent">Operations</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Calendar</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Month overview of bookings, public holidays, and the weekend rate
        schedule. Each square in a date cell marks a booking active that day —
        click a day for details and its applicable rate.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-[42rem] animate-pulse rounded-xl border border-line bg-surface" />
          }
        >
          <CalendarView />
        </Suspense>
      </div>
    </div>
  );
}
