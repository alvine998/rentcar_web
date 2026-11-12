import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CirclePlus, Sparkle } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { HeroFade, Reveal } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import {
  PACKAGES,
  formatRupiah,
  getCarsByPackage,
  getPackage,
  type PackageTier,
} from "@/lib/data";
import { getDictionary, hasLocale, interpolate, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PACKAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/package/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const pkg = getPackage(slug);
  const dict = getDictionary(locale);
  if (!pkg) return { title: dict.packageDetail.breadcrumbPackage };
  const content = dict.packageContent[pkg.slug as PackageTier];
  return pageMetadata({
    locale,
    path: `/package/${pkg.slug}`,
    title: `${pkg.name} ${dict.packageDetail.packageWord}`,
    description: content.description,
    image: getCarsByPackage(pkg.slug as PackageTier)[0].image,
  });
}

export default async function PackageDetailPage(
  props: PageProps<"/[locale]/package/[slug]">,
) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const dict = getDictionary(locale);
  const content = dict.packageContent[pkg.slug as PackageTier];
  const t = dict.packageDetail;
  const cars = getCarsByPackage(pkg.slug as PackageTier);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: t.faq.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      {/* Hero */}
      <section className="hero-bg border-b border-line bg-surface">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <HeroFade>
              <nav className="label text-muted" aria-label="Breadcrumb">
                <Link href={`/${locale}/package`} className="hover:text-accent-strong">
                  {t.breadcrumbPackage}
                </Link>
                <span className="mx-2">/</span>
                 <span className="text-accent-strong">{pkg.name}</span>
              </nav>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                {pkg.name}
                <span className="block text-muted">{t.packageWord}</span>
              </h1>
              <p className="label mt-4 text-accent">{content.tagline}</p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {content.description}
              </p>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {formatRupiah(pkg.priceFrom)}
                </span>
                <span className="text-muted">
                  {dict.common.perDay}, {dict.common.from}
                </span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
                >
                  {interpolate(t.book, { name: pkg.name })}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={`/${locale}/package`}
                  className="inline-flex h-12 items-center rounded-md border border-line bg-surface px-6 text-sm font-medium transition-colors hover:border-accent hover:text-accent-strong"
                >
                  {t.compare}
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted">
                <span className="font-medium text-accent-strong">{t.goodFor}</span>{" "}
                {content.suitableFor}
              </p>
            </HeroFade>
          </div>

          <HeroFade delay={0.15}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line shadow-sm">
                <Image
                  src={cars[0].image}
                  alt={`${cars[0].brand} ${cars[0].name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 36rem, 92vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {t.pictured} {cars[0].year} {cars[0].brand} {cars[0].name}
                {" · "}
                {interpolate(t.carsCount, { n: cars.length })}
              </figcaption>
            </figure>
          </HeroFade>
        </div>
      </section>

      {/* Includes */}
      <section className="border-b border-line">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <p className="label text-accent">{t.includedLabel}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              {interpolate(t.everythingIn, { name: pkg.name })}
            </h2>
            <ul className="mt-8 space-y-4">
              {content.includes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-line pb-4 last:border-0"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="label text-accent">{t.extrasLabel}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              {t.addToTrip}
            </h2>
            <ul className="mt-8 space-y-4">
              {content.extras.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-line pb-4 last:border-0"
                >
                  <CirclePlus
                    className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                    aria-hidden
                  />
                  <span className="text-base leading-relaxed text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-line bg-surface p-6">
              <div className="flex items-center gap-2">
                <Sparkle className="h-4 w-4 text-accent" aria-hidden />
                <p className="text-sm font-semibold">{t.longStay.title}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t.longStay.description}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cars */}
      <section className="border-b border-line bg-surface">
        <div className="container-site py-16 lg:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-accent">{t.availableLabel}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                {interpolate(t.carsInTitle, { name: pkg.name })}
              </h2>
            </div>
            <Link
              href={`/${locale}/cars`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-strong"
            >
              {t.fullFleet}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (
              <Reveal key={car.slug} delay={i * 0.07}>
                <article className="overflow-hidden rounded-xl border border-line bg-paper">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={car.image}
                      alt={`${car.brand} ${car.name}`}
                      fill
                      sizes="(min-width: 1024px) 22rem, 45vw"
                      className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="label text-muted">{car.brand}</p>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight">
                      {car.name}{" "}
                      <span className="font-normal text-muted">{car.year}</span>
                    </h3>
                    <p className="mt-3 text-lg font-bold">
                      {formatRupiah(car.pricePerDay)}
                      <span className="text-xs font-normal text-muted">
                        {" "}
                        {dict.common.perDay}
                      </span>
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-line">
        <div className="container-site py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <p className="label text-accent">{t.faq.label}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                {t.faq.title}
              </h2>
              <p className="mt-5 text-muted">
                {t.faq.lead}{" "}
                <a
                  href="tel:+622172088456"
                  className="text-accent-strong underline underline-offset-4"
                >
                  {dict.footer.phone}
                </a>{" "}
                {t.faq.tail}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion items={t.faq.items} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band-dark text-ink">
        <div className="container-site flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight">
            {interpolate(t.cta.title, { name: pkg.name })}
          </h2>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            {t.cta.button}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
