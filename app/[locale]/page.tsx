import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  KeyRound,
  Search,
  Star,
} from "lucide-react";
import { CarCard } from "@/components/car-card";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { JsonLd } from "@/components/json-ld";
import { HeroFade, Reveal } from "@/components/motion";
import {
  CARS,
  PACKAGES,
  formatRupiah,
  type PackageTier,
} from "@/lib/data";
import { getDictionary, hasLocale, interpolate } from "@/lib/i18n";
import { businessJsonLd, pageMetadata } from "@/lib/seo";

const STEP_ICONS = [Search, CalendarCheck, BadgeCheck, KeyRound];

export async function generateMetadata(
  props: PageProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "",
    title: dict.meta.title,
    description: dict.meta.description,
    absoluteTitle: true,
  });
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.home;
  const popular = CARS.filter((c) => c.popular).slice(0, 4);

  return (
    <>
      <JsonLd data={businessJsonLd()} />

      {/* Hero */}
      <section className="hero-bg text-ink">
        <HeroSlideshow />
        <div className="container-site py-24 lg:py-32">
          <div className="max-w-2xl">
            <HeroFade delay={0.05}>
              <p className="label text-accent-strong">{t.hero.label}</p>
            </HeroFade>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              <HeroFade delay={0.12}>{t.hero.titleLine1}</HeroFade>
              <HeroFade delay={0.22}>
                <span className="block text-muted">{t.hero.titleLine2}</span>
              </HeroFade>
            </h1>
            <HeroFade delay={0.32}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {t.hero.description}
              </p>
            </HeroFade>
            <HeroFade delay={0.42}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${locale}/cars`}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-7 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
                >
                  {t.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={`/${locale}/package`}
                  className="inline-flex h-12 items-center rounded-md border border-ink/20 bg-white/70 px-7 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent-strong"
                >
                  {t.hero.secondaryCta}
                </Link>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted">
                {t.hero.note}
              </p>
            </HeroFade>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface">
        <dl className="container-site grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {t.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="px-0 py-8 lg:px-8 lg:first:pl-0">
                <dt className="label text-muted">{s.label}</dt>
                <dd className="mt-2 text-3xl font-bold">
                  {s.value}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Popular cars */}
      <section className="border-b border-line">
        <div className="container-site py-20 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-accent">{t.fleet.label}</p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                {t.fleet.title}
              </h2>
            </div>
            <Link
              href={`/${locale}/cars`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-strong"
            >
              {t.fleet.viewAll}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((car, i) => (
              <Reveal key={car.slug} delay={i * 0.07}>
                <CarCard car={car} locale={locale} common={dict.common} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="border-b border-line bg-surface">
        <div className="container-site py-20 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="label text-accent">{t.packages.label}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.packages.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t.packages.description}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p, i) => {
              const content = dict.packageContent[p.slug as PackageTier];
              return (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <article className="flex h-full flex-col rounded-xl border border-line bg-paper p-8">
                    <p className="label text-muted">{content.tagline}</p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight">
                      {p.name}
                    </h3>
                    <p className="mt-4 text-3xl font-bold">
                      {formatRupiah(p.priceFrom)}
                      <span className="text-sm font-normal text-muted">
                        {" "}
                        {dict.common.perDay}
                      </span>
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {content.description}
                    </p>
                    <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                      {content.includes.slice(0, 4).map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm">
                          <BadgeCheck
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/${locale}/package/${p.slug}`}
                      className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface text-sm font-medium text-accent-strong transition-colors hover:border-accent hover:bg-accent hover:text-white"
                    >
                      {interpolate(t.packages.seeDetails, { name: p.name })}
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line">
        <div className="container-site py-20 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="label text-accent">{t.steps.label}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.steps.title}
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.items.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <Reveal key={step.title} delay={i * 0.08}>
                  <li className="h-full bg-paper p-8">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-accent" aria-hidden />
                      <span className="font-mono text-xs text-muted">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-b border-line bg-surface">
        <div className="container-site py-20 lg:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-accent">{t.reviews.label}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {t.reviews.title}
              </h2>
            </div>
            <p className="flex items-center gap-2 font-mono text-sm text-muted">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
              {t.reviews.rating}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {t.reviews.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col justify-between rounded-xl border border-line bg-paper p-8">
                  <blockquote className="text-base leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 border-t border-line pt-5">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="label mt-1 text-muted">{item.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band-dark text-ink">
        <div className="container-site flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              {t.cta.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{t.cta.description}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                {t.cta.bookNow}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="tel:+622172088456"
                className="inline-flex h-12 items-center rounded-md border border-ink/20 bg-white/70 px-6 text-sm font-medium transition-colors hover:border-accent hover:text-accent-strong"
              >
                {dict.footer.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
