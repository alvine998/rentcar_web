"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { formatRupiah, type Car, type PackageTier } from "@/lib/data";

const CATEGORIES = ["City", "MPV", "SUV", "Luxury"] as const;
const PHOTOS = [
  "/cars/avanza.jpg",
  "/cars/brio.jpg",
  "/cars/innova.jpg",
  "/cars/xpander.jpg",
  "/cars/ertiga.jpg",
  "/cars/fortuner.jpg",
  "/cars/hrv.jpg",
  "/cars/alphard.jpg",
  "/cars/xenia.jpg",
  "/cars/stargazer.jpg",
];
const TIERS: PackageTier[] = ["regular", "premium", "vip"];

export function CarsManager({ initialCars }: { initialCars: Car[] }) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [adding, setAdding] = useState(false);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);

  function remove(slug: string) {
    setCars((prev) => prev.filter((c) => c.slug !== slug));
  }

  function setPrice(slug: string, price: number) {
    setCars((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, pricePerDay: price } : c)),
    );
  }

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const brand = String(fd.get("brand") ?? "").trim();
    const name = String(fd.get("name") ?? "").trim();
    const packages = TIERS.filter((t) => fd.get(`pkg-${t}`) === "on");
    const car: Car = {
      slug: `${brand}-${name}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      brand,
      name,
      year: Number(fd.get("year")) || 2024,
      category: String(fd.get("category")) as Car["category"],
      transmission: String(fd.get("transmission")) as Car["transmission"],
      seats: Number(fd.get("seats")) || 7,
      fuel: "Petrol",
      pricePerDay: Number(fd.get("price")) || 350000,
      image: String(fd.get("image")) || PHOTOS[0],
      packages: packages.length ? packages : ["regular"],
    };
    setCars((prev) => [car, ...prev]);
    setAdding(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {cars.length} units in the fleet. Click a price to edit it inline.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add car
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[52rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="label px-4 py-3 text-muted">Car</th>
              <th className="label px-4 py-3 text-muted">Category</th>
              <th className="label px-4 py-3 text-muted">Specs</th>
              <th className="label px-4 py-3 text-muted">Packages</th>
              <th className="label px-4 py-3 text-muted">Price / day</th>
              <th className="label px-4 py-3 text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, i) => (
              <motion.tr
                key={car.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
                className={i % 2 === 1 ? "bg-paper/50" : ""}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line">
                      <Image
                        src={car.image}
                        alt={`${car.brand} ${car.name}`}
                        fill
                        sizes="4rem"
                        className="object-cover"
                      />
                    </span>
                    <div>
                      <p className="font-medium">
                        {car.brand} {car.name}
                      </p>
                      <p className="text-xs text-muted">{car.year}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md border border-line px-2 py-0.5 text-xs">
                    {car.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {car.seats} seats · {car.transmission}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {car.packages.map((p) => (
                      <span
                        key={p}
                        className="rounded-md bg-accent/10 px-2 py-0.5 text-xs capitalize text-accent"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {editingPrice === car.slug ? (
                    <input
                      type="number"
                      defaultValue={car.pricePerDay}
                      min={50000}
                      step={25000}
                      autoFocus
                      onBlur={(e) => {
                        setPrice(car.slug, Number(e.target.value) || car.pricePerDay);
                        setEditingPrice(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setPrice(
                            car.slug,
                            Number((e.target as HTMLInputElement).value) ||
                              car.pricePerDay,
                          );
                          setEditingPrice(null);
                        }
                      }}
                      className="h-9 w-32 rounded-md border border-ink px-2 font-mono text-sm outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingPrice(car.slug)}
                      className="inline-flex items-center gap-1.5 font-mono hover:text-accent"
                    >
                      {formatRupiah(car.pricePerDay)}
                      <Pencil className="h-3 w-3 text-muted" aria-hidden />
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => remove(car.slug)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add car modal */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6 backdrop-blur-sm"
            onClick={() => setAdding(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-line bg-surface p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Add a car
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    New units appear in the fleet list immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <form onSubmit={onAdd} className="mt-6 grid gap-4 sm:grid-cols-2">
                <ModalField label="Brand">
                  <input required name="brand" className="input" placeholder="Toyota" />
                </ModalField>
                <ModalField label="Model">
                  <input required name="name" className="input" placeholder="Avanza Veloz" />
                </ModalField>
                <ModalField label="Year">
                  <input
                    required
                    type="number"
                    name="year"
                    defaultValue={2024}
                    min={2015}
                    max={2030}
                    className="input"
                  />
                </ModalField>
                <ModalField label="Category">
                  <select name="category" className="input" defaultValue="MPV">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </ModalField>
                <ModalField label="Transmission">
                  <select name="transmission" className="input" defaultValue="Automatic">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </ModalField>
                <ModalField label="Seats">
                  <input
                    required
                    type="number"
                    name="seats"
                    defaultValue={7}
                    min={2}
                    max={12}
                    className="input"
                  />
                </ModalField>
                <ModalField label="Price / day (Rp)">
                  <input
                    required
                    type="number"
                    name="price"
                    defaultValue={350000}
                    min={50000}
                    step={25000}
                    className="input"
                  />
                </ModalField>
                <ModalField label="Photo">
                  <select name="image" className="input" defaultValue={PHOTOS[0]}>
                    {PHOTOS.map((p) => (
                      <option key={p} value={p}>
                        {p.replace("/cars/", "")}
                      </option>
                    ))}
                  </select>
                </ModalField>
                <ModalField label="Packages" className="sm:col-span-2">
                  <div className="flex flex-wrap gap-4 pt-1">
                    {TIERS.map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={`pkg-${t}`}
                          defaultChecked={t === "regular"}
                          className="h-4 w-4 accent-[#2f5d50]"
                        />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </ModalField>

                <div className="flex gap-3 pt-2 sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-accent"
                  >
                    Add to fleet
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalField({
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
