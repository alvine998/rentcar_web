"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { formatRupiah } from "@/lib/data";

type PackageState = {
  slug: string;
  name: string;
  priceFrom: number;
  includes: string[];
};

export function PackagesManager({ initial }: { initial: PackageState[] }) {
  const [items, setItems] = useState<PackageState[]>(initial);
  const [adding, setAdding] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  function setPrice(slug: string, price: number) {
    setItems((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, priceFrom: price } : p)),
    );
  }

  function setName(slug: string, name: string) {
    const text = name.trim();
    if (!text) return;
    setItems((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, name: text } : p)),
    );
  }

  function removeInclude(slug: string, index: number) {
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, includes: p.includes.filter((_, i) => i !== index) }
          : p,
      ),
    );
  }

  function addInclude(slug: string, value: string) {
    const text = value.trim();
    if (!text) return;
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, includes: [...p.includes, text] } : p,
      ),
    );
  }

  function removePackage(slug: string) {
    const pkg = items.find((p) => p.slug === slug);
    if (
      !window.confirm(
        `Delete the "${pkg?.name ?? slug}" package? This cannot be undone.`,
      )
    ) {
      return;
    }
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }

  function createPackage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    if (!name) return;

    const slugBase =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      "package";
    let slug = slugBase;
    let n = 2;
    while (items.some((p) => p.slug === slug)) {
      slug = `${slugBase}-${n++}`;
    }

    const includes = String(fd.get("includes") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    setItems((prev) => [
      ...prev,
      {
        slug,
        name,
        priceFrom: Number(fd.get("price")) || 500000,
        includes,
      },
    ]);
    setAdding(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {items.length} packages in the catalogue. Click a price or name to
          edit it inline.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add package
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-xl border border-line bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-2">
              {editingName === p.slug ? (
                <input
                  defaultValue={p.name}
                  autoFocus
                  onBlur={(e) => {
                    setName(p.slug, e.target.value);
                    setEditingName(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                    if (e.key === "Escape") setEditingName(null);
                  }}
                  className="input h-9 flex-1"
                />
              ) : (
                <h2 className="text-lg font-semibold tracking-tight">
                  {p.name}
                </h2>
              )}
              <div className="flex items-center gap-1.5">
                <span className="label rounded-md bg-accent/10 px-2 py-1 text-accent">
                  {p.slug}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingName(p.slug)}
                  aria-label="Rename package"
                  className="text-muted transition-colors hover:text-accent-strong"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => removePackage(p.slug)}
                  aria-label="Delete package"
                  className="text-muted transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="label mb-2 block text-muted">
                Starting price / day (Rp)
              </span>
              <input
                type="number"
                value={p.priceFrom}
                min={50000}
                step={25000}
                onChange={(e) => setPrice(p.slug, Number(e.target.value) || 0)}
                className="input font-mono"
              />
            </label>
            <p className="mt-2 text-xs text-muted">
              Shown publicly as {formatRupiah(p.priceFrom)} / day
            </p>

            <div className="mt-6 border-t border-line pt-5">
              <p className="label text-muted">Inclusions ({p.includes.length})</p>
              <ul className="mt-3 space-y-2">
                {p.includes.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="group flex items-start gap-2 rounded-md border border-line px-3 py-2 text-sm"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeInclude(p.slug, index)}
                      aria-label="Remove inclusion"
                      className="text-muted opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
                {p.includes.length === 0 && (
                  <li className="rounded-md border border-dashed border-line px-3 py-4 text-center text-xs text-muted">
                    No inclusions yet.
                  </li>
                )}
              </ul>

              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "inclusion",
                  ) as HTMLInputElement;
                  addInclude(p.slug, input.value);
                  input.value = "";
                }}
              >
                <input
                  name="inclusion"
                  placeholder="Add an inclusion…"
                  className="input h-9 flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-white transition-colors hover:bg-accent-strong"
                  aria-label="Add inclusion"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </form>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted lg:col-span-3">
            No packages yet. Add one to publish it in the catalogue.
          </div>
        )}
      </div>

      {/* Add package modal */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-accent/15 p-6 backdrop-blur-sm"
            onClick={() => setAdding(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border border-line bg-surface p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Add a package
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    The slug is generated from the name and used in URLs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted hover:text-accent-strong"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <form onSubmit={createPackage} className="mt-6 grid gap-4">
                <label className="block">
                  <span className="label mb-2 block text-muted">Name</span>
                  <input
                    required
                    name="name"
                    className="input"
                    placeholder="e.g. Family"
                  />
                </label>
                <label className="block">
                  <span className="label mb-2 block text-muted">
                    Starting price / day (Rp)
                  </span>
                  <input
                    required
                    type="number"
                    name="price"
                    defaultValue={500000}
                    min={50000}
                    step={25000}
                    className="input font-mono"
                  />
                </label>
                <label className="block">
                  <span className="label mb-2 block text-muted">
                    Inclusions (one per line)
                  </span>
                  <textarea
                    name="includes"
                    rows={4}
                    placeholder={"Free driver\nFuel included\n24/7 support"}
                    className="input"
                  />
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center rounded-md bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
                  >
                    Add package
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm text-muted transition-colors hover:border-accent hover:text-accent-strong"
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
