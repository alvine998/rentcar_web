"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Trash2 } from "lucide-react";
import { formatRupiah, type PackageTier } from "@/lib/data";

type PackageState = {
  slug: PackageTier;
  name: string;
  priceFrom: number;
  includes: string[];
};

export function PackagesManager({ initial }: { initial: PackageState[] }) {
  const [items, setItems] = useState<PackageState[]>(initial);

  function setPrice(slug: PackageTier, price: number) {
    setItems((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, priceFrom: price } : p)),
    );
  }

  function removeInclude(slug: PackageTier, index: number) {
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, includes: p.includes.filter((_, i) => i !== index) }
          : p,
      ),
    );
  }

  function addInclude(slug: PackageTier, value: string) {
    const text = value.trim();
    if (!text) return;
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, includes: [...p.includes, text] } : p,
      ),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((p, i) => (
        <motion.div
          key={p.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col rounded-xl border border-line bg-surface p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
            <span className="label rounded-md bg-accent/10 px-2 py-1 text-accent">
              {p.slug}
            </span>
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
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-paper transition-colors hover:bg-accent"
                aria-label="Add inclusion"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
