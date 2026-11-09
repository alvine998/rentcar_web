import type { Metadata } from "next";
import { PackagesManager } from "@/components/admin/packages-manager";
import { PACKAGES, type PackageTier } from "@/lib/data";
import { en } from "@/lib/i18n/en";

export const metadata: Metadata = { title: "Package Management" };

export default function PackagesAdminPage() {
  const initial = PACKAGES.map((p) => ({
    slug: p.slug as PackageTier,
    name: p.name,
    priceFrom: p.priceFrom,
    includes: en.packageContent[p.slug as PackageTier].includes,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <p className="label text-accent">Content</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Packages</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Adjust starting prices and inclusions for Regular, Premium, and VIP.
        Changes apply to the public package pages and booking form.
      </p>
      <div className="mt-8">
        <PackagesManager initial={initial} />
      </div>
    </div>
  );
}
