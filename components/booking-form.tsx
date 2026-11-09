"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Check } from "lucide-react";
import { formatRupiah, type Car, type PackageTier } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/en";

export function BookingForm({
  form,
  packages,
  cars,
}: {
  form: Dictionary["contact"]["form"];
  packages: { slug: string; name: string; priceFrom: number }[];
  cars: Car[];
}) {
  const [sent, setSent] = useState(false);
  const [pkg, setPkg] = useState("");
  const [car, setCar] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const carOptions = pkg
    ? cars.filter((c) => c.packages.includes(pkg as PackageTier))
    : [];
  const selectedCar = carOptions.find((c) => c.slug === car) ?? null;

  let days = 0;
  if (pickup && dropoff) {
    const a = new Date(pickup).getTime();
    const b = new Date(dropoff).getTime();
    if (!Number.isNaN(a) && !Number.isNaN(b) && b >= a) {
      days = Math.round((b - a) / 86_400_000) + 1;
    }
  }

  const total =
    selectedCar && days > 0 ? selectedCar.pricePerDay * days : null;

  function onPackageChange(value: string) {
    setPkg(value);
    const available = cars.filter((c) =>
      c.packages.includes(value as PackageTier),
    );
    if (car && !available.some((c) => c.slug === car)) setCar("");
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-3 rounded-xl border border-line bg-surface p-8"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-paper">
              <Check className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="text-xl font-semibold tracking-tight">
              {form.success.title}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {form.success.description}
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-2 text-sm font-medium text-accent underline underline-offset-4"
            >
              {form.success.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-5 rounded-xl border border-line bg-surface p-8 shadow-sm sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <Field label={form.fields.name}>
              <input
                required
                type="text"
                name="name"
                placeholder={form.placeholders.name}
                className="input"
              />
            </Field>
            <Field label={form.fields.phone}>
              <input
                required
                type="tel"
                name="phone"
                placeholder={form.placeholders.phone}
                className="input"
              />
            </Field>
            <Field label={form.fields.package}>
              <select
                required
                name="package"
                value={pkg}
                onChange={(e) => onPackageChange(e.target.value)}
                className="input"
              >
                <option value="" disabled>
                  {form.placeholders.package}
                </option>
                {packages.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {form.packages[p.slug as keyof typeof form.packages]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={form.fields.driver}>
              <select required name="driver" defaultValue="" className="input">
                <option value="" disabled>
                  {form.placeholders.driver}
                </option>
                <option value="with-driver">
                  {form.driverOptions.withDriver}
                </option>
                <option value="no-driver">{form.driverOptions.noDriver}</option>
              </select>
            </Field>
            <Field label={form.fields.car} className="sm:col-span-2">
              <select
                required
                name="car"
                value={car}
                disabled={!pkg}
                onChange={(e) => setCar(e.target.value)}
                className="input disabled:cursor-not-allowed disabled:bg-paper disabled:text-muted"
              >
                <option value="" disabled>
                  {pkg ? form.placeholders.car : form.placeholders.carFirst}
                </option>
                {carOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.brand} {c.name} — {formatRupiah(c.pricePerDay)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={form.fields.pickupDate}>
              <input
                required
                type="date"
                name="pickup_date"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  if (dropoff && e.target.value > dropoff) setDropoff("");
                }}
                className="input"
              />
            </Field>
            <Field label={form.fields.returnDate}>
              <input
                required
                type="date"
                name="return_date"
                min={pickup || undefined}
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="input"
              />
            </Field>
            <Field label={form.fields.location} className="sm:col-span-2">
              <input
                required
                type="text"
                name="location"
                placeholder={form.placeholders.location}
                className="input"
              />
            </Field>
            <Field label={form.fields.notes} className="sm:col-span-2">
              <textarea
                name="notes"
                rows={4}
                placeholder={form.placeholders.notes}
                className="input resize-y"
              />
            </Field>

            {/* Live price estimate */}
            <div className="sm:col-span-2">
              <AnimatePresence mode="wait">
                {total !== null && selectedCar ? (
                  <motion.div
                    key={`${selectedCar.slug}-${days}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/5 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-paper">
                        <Calculator className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="label text-muted">
                          {form.estimate.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {selectedCar.brand} {selectedCar.name} ·{" "}
                          {formatRupiah(selectedCar.pricePerDay)} × {days}{" "}
                          {days === 1 ? form.estimate.day : form.estimate.days}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-2xl font-semibold">
                      {formatRupiah(total)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-dashed border-line p-4 text-xs leading-relaxed text-muted"
                  >
                    {form.estimate.note}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="sm:col-span-2">
              <motion.button
                type="submit"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="inline-flex h-11 items-center rounded-md bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-accent"
              >
                {form.submit}
              </motion.button>
              <p className="mt-3 text-xs text-muted">{form.note}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="label mb-2 block text-muted">{label}</span>
      {children}
    </label>
  );
}
