import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/motion";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { PACKAGES } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: "%s — Nusa Rentcar",
    },
    description: dict.meta.description,
    alternates: {
      languages: {
        id: "/id",
        en: "/en",
        zh: "/zh",
        "x-default": "/id",
      },
    },
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/cars/xpander.jpg", alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/cars/xpander.jpg"],
    },
  };
}

export default async function RootLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const packageItems = PACKAGES.map((p) => ({
    slug: p.slug,
    name: p.name,
    priceFrom: p.priceFrom,
    tagline: dict.packageContent[p.slug].tagline,
  }));

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Suspense fallback={<div className="h-16 border-b border-line" />}>
          <SiteHeader
            locale={locale}
            nav={dict.nav}
            brandLine={dict.footer.brandLine}
            packageItems={packageItems}
          />
        </Suspense>
        <Suspense fallback={<main className="flex-1">{props.children}</main>}>
          <PageTransition>
            <main className="flex-1">{props.children}</main>
          </PageTransition>
        </Suspense>
        <SiteFooter
          locale={locale}
          footer={dict.footer}
          nav={dict.nav}
          perDay={dict.common.perDay}
          packageItems={packageItems}
        />
      </body>
    </html>
  );
}
