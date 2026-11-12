"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  STATUSES,
  formatDate,
  type Booking,
  type BookingStatus,
} from "@/lib/admin-data";
import { formatRupiah, type PackageTier } from "@/lib/data";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ongoing: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-zinc-100 text-zinc-600 border-zinc-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const PACKAGE_LABELS: Record<PackageTier, string> = {
  regular: "Regular",
  premium: "Premium",
  vip: "VIP",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function BookingsTable({
  bookings,
  limit,
  showFilters = true,
}: {
  bookings: Booking[];
  limit?: number;
  showFilters?: boolean;
}) {
  const [rows, setRows] = useState<Booking[]>(bookings);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const filtered =
    filter === "all" ? rows : rows.filter((b) => b.status === filter);
  const visible = limit ? filtered.slice(0, limit) : filtered;

  function setStatus(id: string, status: BookingStatus) {
    setRows((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  }

  return (
    <div>
      {showFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
            <span className="ml-1.5 font-mono text-xs opacity-60">
              {rows.length}
            </span>
          </FilterChip>
          {STATUSES.map((s) => (
            <FilterChip
              key={s}
              active={filter === s}
              onClick={() => setFilter(s)}
            >
              <span className="capitalize">{s}</span>
              <span className="ml-1.5 font-mono text-xs opacity-60">
                {rows.filter((b) => b.status === s).length}
              </span>
            </FilterChip>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[54rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="label px-4 py-3 text-muted">ID</th>
              <th className="label px-4 py-3 text-muted">Customer</th>
              <th className="label px-4 py-3 text-muted">Car</th>
              <th className="label px-4 py-3 text-muted">Package</th>
              <th className="label px-4 py-3 text-muted">Driver</th>
              <th className="label px-4 py-3 text-muted">Dates</th>
              <th className="label px-4 py-3 text-muted">Total</th>
              <th className="label px-4 py-3 text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b, i) => (
              <motion.tr
                key={b.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className={i % 2 === 1 ? "bg-paper/50" : ""}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {b.id}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted">{b.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{b.car}</p>
                  <p className="text-xs text-muted">{b.location}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md border border-line px-2 py-0.5 text-xs">
                    {PACKAGE_LABELS[b.package]}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {b.driver ? "With driver" : "No driver"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(b.pickup)} — {formatDate(b.ret)}
                </td>
                <td className="px-4 py-3 font-mono">
                  {formatRupiah(b.total)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    onChange={(e) =>
                      setStatus(b.id, e.target.value as BookingStatus)
                    }
                    className={`h-8 rounded-full border px-2.5 text-xs font-medium capitalize outline-none transition-colors ${STATUS_STYLES[b.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </motion.tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-muted"
                >
                  No bookings with this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-md border px-3.5 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-line bg-surface text-muted hover:border-accent hover:text-accent-strong"
      }`}
    >
      {children}
    </button>
  );
}
