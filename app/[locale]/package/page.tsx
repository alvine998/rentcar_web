import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Reveal } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import { PACKAGES, formatRupiah, type PackageTier } from "@/lib/data";
import { getDictionary, hasLocale, interpolate } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/package">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/package",
    title: dict.packages.label,
    description: dict.packages.description,
    image: "/cars/alphard.jpg",
  });
}

export default async function PackagePage(
  props: PageProps<"/[locale]/package">,
) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.packages;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t.compareTitle,
          itemListElement: PACKAGES.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: `${p.name} ${t.label}`,
              description: dict.packageContent[p.slug as PackageTier].description,
              offers: {
                "@type": "Offer",
                price: p.priceFrom,
                priceCurrency: "IDR",
              },
            },
          })),
        }}
      />

      <section className="hero-bg border-b border-line">
        <div className="container-site py-16 lg:py-20">
          <Reveal>
            <p className="label text-accent">{t.label}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {t.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cards */}
      <section className="border-b border-line bg-surface">
        <div className="container-site grid gap-6 py-16 lg:grid-cols-3 lg:py-20">
          {PACKAGES.map((p, i) => {
            const content = dict.packageContent[p.slug as PackageTier];
            return (
              <Reveal key={p.slug} delay={i * 0.08}>
                <article
                  className={`flex h-full flex-col rounded-xl border p-8 ${
                    p.slug === "premium"
                      ? "border-accent bg-paper"
                      : "border-line bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {p.name}
                    </h2>
                    {p.slug === "premium" && (
                      <span className="label rounded-md bg-accent px-2.5 py-1 text-paper">
                        {t.mostBooked}
                      </span>
                    )}
                  </div>
                  <p className="label mt-2 text-muted">{content.tagline}</p>
                  <p className="mt-6 font-mono text-3xl font-semibold">
                    {formatRupiah(p.priceFrom)}
                    <span className="text-sm font-normal text-muted">
                      {" "}
                      {dict.common.perDay}
                    </span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {content.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {content.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/package/${p.slug}`}
                    className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink text-sm font-medium text-paper transition-colors hover:bg-accent"
                  >
                    {interpolate(t.seePackage, { name: p.name })}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Comparison matrix */}
      <section className="border-b border-line">
        <div className="container-site py-16 lg:py-20">
          <Reveal className="max-w-2xl">
            <p className="label text-accent">{t.compareLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.compareTitle}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto rounded-xl border border-line bg-surface">
              <table className="w-full min-w-[42rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="label p-4 text-left text-muted">
                      {t.matrixFeature}
                    </th>
                    {PACKAGES.map((p) => (
                      <th key={p.slug} className="p-4 text-left">
                        <Link
                          href={`/${locale}/package/${p.slug}`}
                          className="font-semibold hover:text-accent"
                        >
                          {p.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.matrix.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 1 ? "bg-paper" : ""}
                    >
                      <td className="p-4 text-muted">{row.feature}</td>
                      {(["regular", "premium", "vip"] as const).map((tier) => {
                        const value = row[tier];
                        return (
                          <td key={tier} className="p-4">
                            {value === true ? (
                              <Check
                                className="h-4 w-4 text-accent"
                                aria-label="✓"
                              />
                            ) : value === false ? (
                              <Minus
                                className="h-4 w-4 text-muted/50"
                                aria-label="—"
                              />
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-accent"
              >
                {t.bookPackage}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`/${locale}/cars`}
                className="inline-flex h-12 items-center rounded-md border border-ink px-6 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
              >
                {t.browseFirst}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
