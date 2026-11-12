"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Percent, Plus, Trash2 } from "lucide-react";
import {
  DAY_MULTIPLIERS,
  HOLIDAYS,
  HOLIDAY_MULTIPLIER,
  formatRupiah,
  roundRate,
  type Holiday,
} from "@/lib/data";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function PricingRules({ sampleBase }: { sampleBase: number }) {
  const [multipliers, setMultipliers] = useState<number[]>(DAY_MULTIPLIERS);
  const [holidayMultiplier, setHolidayMultiplier] =
    useState(HOLIDAY_MULTIPLIER);
  const [holidays, setHolidays] = useState<Holiday[]>(HOLIDAYS);

  function setMultiplier(index: number, percent: number) {
    setMultipliers((prev) =>
      prev.map((m, i) => (i === index ? (percent || 0) / 100 : m)),
    );
  }

  function addHoliday(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = String(fd.get("date") ?? "");
    const name = String(fd.get("name") ?? "").trim();
    if (!date || !name) return;
    setHolidays((prev) =>
      [...prev, { date, name }].sort((a, b) => a.date.localeCompare(b.date)),
    );
    e.currentTarget.reset();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-line bg-surface p-6"
    >
      <div className="flex items-center gap-2">
        <Percent className="h-4 w-4 text-accent" aria-hidden />
        <h2 className="text-lg font-semibold tracking-tight">Pricing rules</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Rates change by weekday and on public holidays. Multipliers apply to
        each car&apos;s base price — example below uses a{" "}
        {formatRupiah(sampleBase)} base rate.
      </p>

      {/* Weekday multipliers */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {DAY_LABELS.map((label, i) => (
          <div key={label} className="rounded-md border border-line p-3">
            <p className="label text-muted">{label}</p>
            <div className="mt-2 flex items-center gap-1">
              <input
                type="number"
                value={Math.round(multipliers[i] * 100)}
                min={50}
                max={300}
                step={5}
                onChange={(e) => setMultiplier(i, Number(e.target.value))}
                className="h-9 w-full rounded-md border border-line px-2 font-mono text-sm outline-none focus:border-accent"
              />
              <span className="text-xs text-muted">%</span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-accent">
              {formatRupiah(roundRate(sampleBase * multipliers[i]))}
            </p>
          </div>
        ))}
      </div>

      {/* Holiday multiplier */}
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-md border border-amber-200 bg-amber-50 p-4">
        <div>
          <p className="label text-amber-700">Holiday multiplier</p>
          <p className="mt-1 text-xs text-amber-800">
            Applies to every date in the holiday calendar below.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={Math.round(holidayMultiplier * 100)}
            min={100}
            max={400}
            step={5}
            onChange={(e) =>
              setHolidayMultiplier((Number(e.target.value) || 100) / 100)
            }
            className="h-9 w-24 rounded-md border border-amber-300 bg-white px-2 font-mono text-sm outline-none focus:border-amber-500"
          />
          <span className="text-xs text-amber-700">%</span>
        </div>
        <p className="font-mono text-sm text-amber-800">
          {formatRupiah(roundRate(sampleBase * holidayMultiplier))} on{" "}
          {formatRupiah(sampleBase)} base
        </p>
      </div>

      {/* Holiday calendar */}
      <div className="mt-6 border-t border-line pt-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
          <h3 className="text-sm font-semibold tracking-tight">
            Holiday calendar ({holidays.length})
          </h3>
        </div>

        <ul className="mt-4 space-y-2">
          {holidays.map((h, i) => (
            <li
              key={`${h.date}-${h.name}`}
              className="group flex items-center gap-3 rounded-md border border-line px-3 py-2 text-sm"
            >
              <span className="w-28 font-mono text-xs text-muted">{h.date}</span>
              <span className="flex-1">{h.name}</span>
              <button
                type="button"
                onClick={() =>
                  setHolidays((prev) => prev.filter((_, idx) => idx !== i))
                }
                aria-label="Remove holiday"
                className="text-muted opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <form
          onSubmit={addHoliday}
          className="mt-4 flex flex-wrap items-end gap-3"
        >
          <label className="block">
            <span className="label mb-2 block text-muted">Date</span>
            <input
              required
              type="date"
              name="date"
              className="input h-9 w-44"
            />
          </label>
          <label className="block flex-1">
            <span className="label mb-2 block text-muted">Name</span>
            <input
              required
              name="name"
              placeholder="e.g. Independence Day"
              className="input h-9"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add holiday
          </button>
        </form>
      </div>
    </motion.section>
  );
}
