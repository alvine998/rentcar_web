import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, CarFront, CircleDollarSign, Clock3 } from "lucide-react";
import { BookingsTable } from "@/components/admin/bookings-table";
import { BOOKINGS } from "@/lib/admin-data";
import { CARS, PACKAGES, formatRupiah } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const totalBookings = BOOKINGS.length;
  const pending = BOOKINGS.filter((b) => b.status === "pending").length;
  const revenue = BOOKINGS
    .filter((b) =>
      ["confirmed", "ongoing", "completed"].includes(b.status),
    )
    .reduce((sum, b) => sum + b.total, 0);

  const stats = [
    {
      label: "Fleet units",
      value: String(CARS.length),
      hint: "Active vehicles",
      icon: CarFront,
    },
    {
      label: "Bookings",
      value: String(totalBookings),
      hint: "All time",
      icon: CalendarClock,
    },
    {
      label: "Pending requests",
      value: String(pending),
      hint: "Needs confirmation",
      icon: Clock3,
    },
    {
      label: "Revenue (booked)",
      value: formatRupiah(revenue),
      hint: "Confirmed + completed",
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-accent">Overview</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Welcome back, Admin
          </h2>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-strong"
        >
          Manage bookings
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <p className="label text-muted">{s.label}</p>
              <s.icon className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Fleet by package */}
      <section className="mt-8 rounded-xl border border-line bg-surface p-6">
        <h3 className="text-sm font-semibold tracking-tight">
          Fleet distribution by package
        </h3>
        <div className="mt-5 space-y-4">
          {PACKAGES.map((p) => {
            const count = CARS.filter((c) => c.packages.includes(p.slug)).length;
            const pct = Math.round((count / CARS.length) * 100);
            return (
              <div key={p.slug}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="font-mono text-xs text-muted">
                    {count} cars · {pct}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent bookings */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight">
            Recent bookings
          </h3>
          <Link
            href="/admin/bookings"
            className="text-sm text-accent hover:text-accent-strong"
          >
            View all
          </Link>
        </div>
        <BookingsTable bookings={BOOKINGS} limit={5} showFilters={false} />
      </section>
    </div>
  );
}
