import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nusarentcar.id";
export const SITE_NAME = "Nusa Rentcar";

const OG_LOCALES: Record<Locale, string> = {
  id: "id_ID",
  en: "en_US",
  zh: "zh_CN",
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = "/cars/xpander.jpg",
  absoluteTitle = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        id: `/id${path}`,
        en: `/en${path}`,
        zh: `/zh${path}`,
        "x-default": `/id${path}`,
      },
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: `/${locale}${path}`,
      locale: OG_LOCALES[locale],
      type: "website",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/cars/xpander.jpg`,
    telephone: "+62-21-7208-8456",
    email: "halo@nusarentcar.id",
    priceRange: "Rp 275.000 – Rp 1.850.000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Panglima Polim Raya No. 24",
      addressLocality: "Jakarta Selatan",
      addressRegion: "Jakarta",
      postalCode: "12160",
      addressCountry: "ID",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
    areaServed: "Jakarta",
  };
}
