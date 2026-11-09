import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { PACKAGES } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

const PATHS = [
  "",
  "/cars",
  "/package",
  "/about",
  "/contact",
  ...PACKAGES.map((p) => `/package/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
      changeFrequency: (path === "" ? "daily" : "weekly") as
        | "daily"
        | "weekly",
      priority: path === "" ? 1 : path === "/cars" || path === "/package" ? 0.8 : 0.6,
      lastModified: new Date("2026-11-07"),
    })),
  );
}
