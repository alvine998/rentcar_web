"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cog, Fuel, Users } from "lucide-react";
import { formatRupiah, type Car } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/en";

export function CarCard({
  car,
  locale,
  common,
}: {
  car: Car;
  locale: Locale;
  common: Dictionary["common"];
}) {
  const transmission =
    car.transmission === "Manual" ? common.manual : common.automatic;
  const fuel =
    car.fuel === "Petrol"
      ? common.petrol
      : car.fuel === "Hybrid"
        ? common.hybrid
        : common.electric;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-[0_2px_12px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-out hover:scale-105"
        />
        {car.popular && (
          <span className="label absolute left-3 top-3 rounded-md bg-accent px-2.5 py-1 text-white">
            {common.popular}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="label text-muted">{car.brand}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">
          {car.name}{" "}
          <span className="font-normal text-muted">{car.year}</span>
        </h3>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {car.seats} {common.seats}
          </li>
          <li className="flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5" aria-hidden />
            {transmission}
          </li>
          <li className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5" aria-hidden />
            {fuel}
          </li>
        </ul>

        <div className="mt-5 border-t border-line pt-4">
          <p>
            <span className="text-xs text-muted">{common.from}</span>
            <span className="ml-1 text-2xl font-bold text-ink">
              {formatRupiah(car.pricePerDay)}
            </span>
            <span className="text-sm text-muted"> {common.perDay}</span>
          </p>
          <Link
            href={`/${locale}/contact`}
            className="mt-4 flex h-10 w-full items-center justify-center rounded-md bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            {common.book}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
