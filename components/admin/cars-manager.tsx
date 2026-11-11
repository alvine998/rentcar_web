"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
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

type PhotoState = { url: string; name: string } | null;
type ModalState = { mode: "add" } | { mode: "edit"; car: Car };

export function CarsManager({ initialCars }: { initialCars: Car[] }) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [photo, setPhoto] = useState<PhotoState>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);

  function openModal(next: ModalState) {
    setModal(next);
    setPhoto(null);
    setUploadError(null);
    setUploading(false);
  }

  function closeModal() {
    setModal(null);
    setPhoto(null);
    setUploadError(null);
  }

  function remove(slug: string) {
    setCars((prev) => prev.filter((c) => c.slug !== slug));
  }

  function setPrice(slug: string, price: number) {
    setCars((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, pricePerDay: price } : c)),
    );
  }

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      input.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be 5 MB or smaller.");
      input.value = "";
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed.");
      }
      setPhoto({ url: data.url, name: file.name });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal || uploading) return;
    const fd = new FormData(e.currentTarget);
    const brand = String(fd.get("brand") ?? "").trim();
    const name = String(fd.get("name") ?? "").trim();
    const packages = TIERS.filter((t) => fd.get(`pkg-${t}`) === "on");
    const base: Omit<Car, "slug"> = {
      brand,
      name,
      year: Number(fd.get("year")) || 2024,
      category: String(fd.get("category")) as Car["category"],
      transmission: String(fd.get("transmission")) as Car["transmission"],
      seats: Number(fd.get("seats")) || 7,
      fuel: "Petrol",
      pricePerDay: Number(fd.get("price")) || 350000,
      image:
        photo?.url ??
        (modal.mode === "edit" ? modal.car.image : PHOTOS[0]),
      packages: packages.length
        ? packages
        : modal.mode === "edit"
          ? modal.car.packages
          : ["regular"],
    };

    if (modal.mode === "edit") {
      setCars((prev) =>
        prev.map((c) => (c.slug === modal.car.slug ? { ...c, ...base } : c)),
      );
    } else {
      const car: Car = {
        ...base,
        slug: `${brand}-${name}-${Date.now()}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      };
      setCars((prev) => [car, ...prev]);
    }
    closeModal();
  }

  const editingCar = modal?.mode === "edit" ? modal.car : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {cars.length} units in the fleet. Click a price to edit it inline.
        </p>
        <button
          type="button"
          onClick={() => openModal({ mode: "add" })}
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openModal({ mode: "edit", car })}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(car.slug)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:border-red-300 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / edit car modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6 backdrop-blur-sm"
            onClick={closeModal}
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
                    {editingCar ? "Edit car" : "Add a car"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {editingCar
                      ? "Changes appear in the fleet list immediately."
                      : "New units appear in the fleet list immediately."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <ModalField label="Brand">
                  <input
                    required
                    name="brand"
                    defaultValue={editingCar?.brand ?? ""}
                    className="input"
                    placeholder="Toyota"
                  />
                </ModalField>
                <ModalField label="Model">
                  <input
                    required
                    name="name"
                    defaultValue={editingCar?.name ?? ""}
                    className="input"
                    placeholder="Avanza Veloz"
                  />
                </ModalField>
                <ModalField label="Year">
                  <input
                    required
                    type="number"
                    name="year"
                    defaultValue={editingCar?.year ?? 2024}
                    min={2015}
                    max={2030}
                    className="input"
                  />
                </ModalField>
                <ModalField label="Category">
                  <select
                    name="category"
                    className="input"
                    defaultValue={editingCar?.category ?? "MPV"}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </ModalField>
                <ModalField label="Transmission">
                  <select
                    name="transmission"
                    className="input"
                    defaultValue={editingCar?.transmission ?? "Automatic"}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </ModalField>
                <ModalField label="Seats">
                  <input
                    required
                    type="number"
                    name="seats"
                    defaultValue={editingCar?.seats ?? 7}
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
                    defaultValue={editingCar?.pricePerDay ?? 350000}
                    min={50000}
                    step={25000}
                    className="input"
                  />
                </ModalField>

                {/* Photo upload */}
                <div className="sm:col-span-2">
                  <span className="label mb-2 block text-muted">Photo</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-line bg-paper">
                      <Image
                        src={photo?.url ?? editingCar?.image ?? PHOTOS[0]}
                        alt="Car photo preview"
                        fill
                        sizes="7rem"
                        className="object-cover"
                      />
                    </span>
                    <div>
                      <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-line bg-surface px-3.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink">
                        <Upload className="h-4 w-4" aria-hidden />
                        {uploading ? "Uploading…" : "Upload image"}
                        <input
                          type="file"
                          name="imageFile"
                          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                          className="hidden"
                          disabled={uploading}
                          onChange={onPickPhoto}
                        />
                      </label>
                      <p className="mt-1.5 text-xs text-muted">
                        {photo
                          ? photo.name
                          : editingCar
                            ? "Choose an image to replace the current photo."
                            : "JPEG, PNG, WebP, AVIF or GIF · max 5 MB"}
                      </p>
                      {uploadError && (
                        <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                      )}
                    </div>
                  </div>
                </div>

                <ModalField label="Packages" className="sm:col-span-2">
                  <div className="flex flex-wrap gap-4 pt-1">
                    {TIERS.map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={`pkg-${t}`}
                          defaultChecked={
                            editingCar
                              ? editingCar.packages.includes(t)
                              : t === "regular"
                          }
                          className="h-4 w-4 accent-accent"
                        />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </ModalField>

                <div className="flex gap-3 pt-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {editingCar ? "Save changes" : "Add to fleet"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
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
