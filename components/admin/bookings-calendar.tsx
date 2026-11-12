"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/bookings-table";
import { STATUSES, type Booking, type BookingStatus } from "@/lib/admin-data";
import {
  DAY_MULTIPLIERS,
  HOLIDAY_MULTIPLIER,
  formatRupiah,
  type Holiday,
} from "@/lib/data";

const DAY_MS = 86_400_000;
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SQUARE_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-emerald-500",
  ongoing: "bg-sky-500",
  completed: "bg-zinc-400",
  cancelled: "border border-red-300 bg-transparent",
};

type DayCell = { iso: string; day: number; inMonth: boolean };

type RateInfo = {
  multiplier: number;
  title: string;
  caption: string;
  weekend: boolean;
  holiday: boolean;
};

function isoOf(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function dowOf(iso: string): number {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7; // Mon = 0
}

function fmtLong(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fmtShort(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function monthMatrix(year: number, month: number): DayCell[][] {
  const first = Date.UTC(year, month, 1);
  const start = first - ((new Date(first).getUTCDay() + 6) % 7) * DAY_MS;
  const last = Date.UTC(year, month + 1, 0);
  const end = last + (6 - ((new Date(last).getUTCDay() + 6) % 7)) * DAY_MS;

  const weeks: DayCell[][] = [];
  let week: DayCell[] = [];
  for (let ts = start; ts <= end; ts += DAY_MS) {
    const d = new Date(ts);
    week.push({
      iso: isoOf(ts),
      day: d.getUTCDate(),
      inMonth: d.getUTCMonth() === month && d.getUTCFullYear() === year,
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}

function bookingsByDay(bookings: Booking[]): Map<string, Booking[]> {
  const map = new Map<string, Booking[]>();
  for (const booking of bookings) {
    for (
      let ts = Date.parse(booking.pickup);
      ts <= Date.parse(booking.ret);
      ts += DAY_MS
    ) {
      const iso = isoOf(ts);
      const list = map.get(iso);
      if (list) list.push(booking);
      else map.set(iso, [booking]);
    }
  }
  return map;
}

function rateFor(iso: string, holiday: Holiday | undefined): RateInfo {
  const dow = dowOf(iso);
  if (holiday) {
    return {
      multiplier: HOLIDAY_MULTIPLIER,
      title: `Holiday rate — ×${HOLIDAY_MULTIPLIER}`,
      caption: `${holiday.name}. Overrides the weekday/weekend rate.`,
      weekend: dow >= 5,
      holiday: true,
    };
  }
  const multiplier = DAY_MULTIPLIERS[dow];
  if (dow === 5 || dow === 6) {
    return {
      multiplier,
      title: `Weekend rate — ×${multiplier}`,
      caption: `Weekend schedule for ${WEEKDAY_LABELS[dow]} (${WEEKDAY_LABELS[5]}–${WEEKDAY_LABELS[6]}).`,
      weekend: true,
      holiday: false,
    };
  }
  if (multiplier !== 1) {
    return {
      multiplier,
      title: `Weekday rate — ×${multiplier}`,
      caption:
        multiplier > 1
          ? "Peak weekday rate from the pricing schedule."
          : "Discounted weekday rate from the pricing schedule.",
      weekend: false,
      holiday: false,
    };
  }
  return {
    multiplier: 1,
    title: "Standard rate — ×1",
    caption: "Base rate, no weekend or holiday multiplier.",
    weekend: false,
    holiday: false,
  };
}

function multLabel(m: number): string {
  return `×${m}`;
}

export function BookingsCalendar({
  bookings,
  holidays,
  todayISO,
}: {
  bookings: Booking[];
  holidays: Holiday[];
  todayISO: string;
}) {
  const [view, setView] = useState(() => {
    const [y, m] = todayISO.split("-").map(Number);
    return { year: y, month: m - 1 };
  });
  const [selected, setSelected] = useState(todayISO);

  const holidayMap = useMemo(
    () => new Map(holidays.map((h) => [h.date, h])),
    [holidays],
  );

  const dayMap = useMemo(() => bookingsByDay(bookings), [bookings]);

  const weeks = useMemo(
    () => monthMatrix(view.year, view.month),
    [view.year, view.month],
  );

  const monthLabel = new Date(
    Date.UTC(view.year, view.month, 1),
  ).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  const active = bookings.filter((b) => selected >= b.pickup && selected <= b.ret);
  const rate = rateFor(selected, holidayMap.get(selected));
  const selectedHoliday = holidayMap.get(selected);

  function goMonth(delta: number) {
    setView((v) => {
      const next = new Date(Date.UTC(v.year, v.month + delta, 1));
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
    });
  }

  function goToday() {
    const [y, m] = todayISO.split("-").map(Number);
    setView({ year: y, month: m - 1 });
    setSelected(todayISO);
  }

  function selectDay(iso: string) {
    setSelected(iso);
    const [y, m] = iso.split("-").map(Number);
    if (y !== view.year || m - 1 !== view.month) {
      setView({ year: y, month: m - 1 });
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-lg font-semibold tracking-tight">
              {monthLabel}
            </h3>
            <span className="label text-muted">
              {bookings.filter((b) => {
                const lastIso = weeks[weeks.length - 1][6].iso;
                return b.pickup <= lastIso && b.ret >= weeks[0][0].iso;
              }).length}{" "}
              bookings in view
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToday}
              className="h-9 rounded-md border border-line bg-surface px-3.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent-strong"
            >
              Today
            </button>
            <div className="flex items-center rounded-md border border-line bg-surface">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                aria-label="Previous month"
                className="flex h-9 w-9 items-center justify-center rounded-l-md text-muted transition-colors hover:text-accent-strong"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => goMonth(1)}
                aria-label="Next month"
                className="flex h-9 w-9 items-center justify-center rounded-r-md border-l border-line text-muted transition-colors hover:text-accent-strong"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <PartyPopper className="h-3 w-3" aria-hidden />
            Holiday
          </span>
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-strong">
            Weekend / rate day
          </span>
          <span className="inline-flex items-center rounded-full border border-accent px-2.5 py-0.5 text-xs font-medium text-accent-strong">
            Today
          </span>
        </div>

        {/* Month grid */}
        <motion.div
          key={`${view.year}-${view.month}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface"
        >
          <div className="min-w-[42rem]">
            <div className="grid grid-cols-7 gap-px bg-line">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={`bg-paper px-2 py-2 text-center ${
                    i >= 5 ? "text-accent" : "text-muted"
                  }`}
                >
                  <span className="label">{label}</span>
                </div>
              ))}
            </div>

            {weeks.map((week) => (
              <div key={week[0].iso} className="grid grid-cols-7 gap-px border-t border-line bg-line">
                {week.map((day) => {
                  const holiday = holidayMap.get(day.iso);
                  const dayRate = rateFor(day.iso, holiday);
                  const dayBookings = dayMap.get(day.iso) ?? [];
                  const isToday = day.iso === todayISO;
                  const isSelected = day.iso === selected;
                  return (
                    <button
                      key={day.iso}
                      type="button"
                      onClick={() => selectDay(day.iso)}
                      aria-pressed={isSelected}
                      className={`min-h-[5.25rem] p-2 text-left transition-colors ${
                        holiday
                          ? "bg-amber-50"
                          : dayRate.weekend
                            ? "bg-accent/[0.06]"
                            : "bg-surface"
                      } ${day.inMonth ? "" : "opacity-45"} ${
                        isSelected ? "ring-2 ring-inset ring-accent" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span
                          className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-medium ${
                            isToday ? "bg-accent text-white" : "text-ink"
                          }`}
                        >
                          {day.day}
                        </span>
                        {dayRate.multiplier !== 1 && (
                          <span
                            className={`rounded px-1 py-0.5 font-mono text-[10px] ${
                              holiday
                                ? "bg-amber-200/70 text-amber-800"
                                : "bg-accent/10 text-accent-strong"
                            }`}
                          >
                            {multLabel(dayRate.multiplier)}
                          </span>
                        )}
                      </div>
                      {holiday && (
                        <p className="mt-1.5 truncate text-[10px] font-medium text-amber-800">
                          {holiday.name}
                        </p>
                      )}
                      {dayBookings.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {dayBookings.map((b) => (
                            <span
                              key={b.id}
                              title={`${b.name} · ${b.car} · ${b.pickup} → ${b.ret} · ${b.status}`}
                              className={`h-2.5 w-2.5 rounded-[3px] ${SQUARE_STYLES[b.status]}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rate schedule */}
        <section className="mt-6 rounded-xl border border-line bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Weekend &amp; holiday rate schedule
              </h3>
              <p className="mt-1 max-w-xl text-xs text-muted">
                Multipliers applied to each car&apos;s base rate per calendar
                day. Holiday rate overrides the weekday and weekend rates.
              </p>
            </div>
            <Link
              href="/admin/packages"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-strong"
            >
              Edit pricing rules
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {WEEKDAY_LABELS.map((label, i) => {
              const m = DAY_MULTIPLIERS[i];
              return (
                <div
                  key={label}
                  className={`rounded-md border p-2.5 text-center ${
                    i >= 5
                      ? "border-accent/30 bg-accent/[0.06]"
                      : "border-line"
                  }`}
                >
                  <p className="label text-muted">{label}</p>
                  <p className="mt-1 font-mono text-sm">{multLabel(m)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-3">
            <span className="label text-amber-700">Holiday rate</span>
            <span className="font-mono text-sm text-amber-800">
              {multLabel(HOLIDAY_MULTIPLIER)}
            </span>
            <span className="text-xs text-amber-800">
              Applied to every date in the holiday list.
            </span>
            <span className="ml-auto font-mono text-xs text-amber-700">
              {holidays.length} holiday{holidays.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-4">
            <p className="label text-muted">Holiday calendar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...holidays]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((h) => (
                  <button
                    key={h.date}
                    type="button"
                    onClick={() => selectDay(h.date)}
                    className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                      selected === h.date
                        ? "border-accent ring-1 ring-accent"
                        : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-400"
                    }`}
                  >
                    <span className="font-mono">{fmtShort(h.date)}</span>
                    <span>{h.name}</span>
                  </button>
                ))}
              {holidays.length === 0 && (
                <p className="text-xs text-muted">No holidays scheduled.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Day detail panel */}
      <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[21rem] lg:self-start">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="label text-accent">Day detail</p>
          <h3 className="mt-2 text-base font-semibold tracking-tight">
            {fmtLong(selected)}
          </h3>
          {selected === todayISO && (
            <p className="mt-1 text-xs font-medium text-muted">Today</p>
          )}

          {/* Rate rule */}
          <div
            className={`mt-4 rounded-md border p-3 ${
              rate.holiday
                ? "border-amber-200 bg-amber-50"
                : rate.weekend
                  ? "border-accent/30 bg-accent/[0.06]"
                  : "border-line"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{rate.title}</p>
              <span className="font-mono text-sm">
                {multLabel(rate.multiplier)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">{rate.caption}</p>
            {selectedHoliday && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
                <PartyPopper className="h-3 w-3" aria-hidden />
                {selectedHoliday.name}
              </p>
            )}
          </div>

          {/* Bookings on this day */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="label text-muted">Bookings</p>
              <span className="font-mono text-xs text-muted">
                {active.length}
              </span>
            </div>

            <ul className="mt-3 space-y-2">
              {active.map((b) => (
                <li
                  key={b.id}
                  className="rounded-md border border-line p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{b.name}</p>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted">
                        {b.id}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="mt-2 truncate text-xs">{b.car}</p>
                  <p className="mt-1 text-xs text-muted">
                    {fmtShort(b.pickup)} — {fmtShort(b.ret)}
                    {b.driver ? " · with driver" : " · no driver"}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="rounded-md border border-line px-2 py-0.5 text-xs capitalize">
                      {b.package}
                    </span>
                    <span className="font-mono text-xs">
                      {formatRupiah(b.total)}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs text-muted">
                    {b.location}
                  </p>
                </li>
              ))}
              {active.length === 0 && (
                <li className="rounded-md border border-dashed border-line px-3 py-8 text-center text-sm text-muted">
                  No bookings on this day.
                </li>
              )}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
