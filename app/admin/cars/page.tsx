import type { Metadata } from "next";
import { CarsManager } from "@/components/admin/cars-manager";
import { CARS } from "@/lib/data";

export const metadata: Metadata = { title: "Fleet Management" };

export default function CarsAdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="label text-accent">Content</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Fleet</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Manage the vehicles shown on the public site. Price changes are
        reflected in the car list and booking estimates.
      </p>
      <div className="mt-8">
        <CarsManager initialCars={CARS} />
      </div>
    </div>
  );
}
