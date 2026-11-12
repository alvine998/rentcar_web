"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARS, type Car } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/en";
import { CarCard } from "@/components/car-card";

const FILTERS = ["All", "City", "MPV", "SUV", "Luxury"] as const;

export function CarCatalog({
  locale,
  common,
  cars = CARS,
}: {
  locale: Locale;
  common: Dictionary["common"];
  cars?: Car[];
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const visible = cars.filter(
    (c) => filter === "All" || c.category === filter,
  );

  const labelFor = (f: (typeof FILTERS)[number]) =>
    f === "All" ? common.all : common.categories[f];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`h-9 rounded-md border px-4 text-sm transition-colors ${
              filter === f
                ? "border-accent bg-accent text-white"
                : "border-line bg-surface text-muted hover:border-accent hover:text-accent-strong"
            }`}
          >
            {labelFor(f)}
            <span className="ml-1.5 font-mono text-xs opacity-60">
              {f === "All"
                ? cars.length
                : cars.filter((c) => c.category === f).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <motion.div
          layout
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((car) => (
              <motion.div
                key={car.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <CarCard car={car} locale={locale} common={common} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="mt-10 rounded-xl border border-line bg-surface p-10 text-center text-muted">
          {common.emptyCategory}
        </p>
      )}
    </div>
  );
}
