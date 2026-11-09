import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins, Wrench } from "lucide-react";
import { HeroFade, Reveal } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { businessJsonLd, pageMetadata } from "@/lib/seo";

const VALUE_ICONS = [Wrench, HandCoins, BadgeCheck];

export async function generateMetadata(
  props: PageProps<"/[locale]/about">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/about",
    title: dict.about.label,
    description: dict.about.description,
    image: "/cars/innova.jpg",
  });
}

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <JsonLd data={businessJsonLd()} />

      {/* Hero */}
      <section className="hero-bg border-b border-line">
        <div className="container-site grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <HeroFade>
              <p className="label text-accent">{t.label}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                {t.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {t.description}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-accent"
              >
                {t.talkToUs}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </HeroFade>
          </div>
          <HeroFade delay={0.15}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line shadow-sm">
                <Image
                  src="/cars/innova.jpg"
                  alt="Toyota Kijang Innova — Nusa Rentcar"
                  fill
                  priority
                  sizes="(min-width: 1024px) 36rem, 92vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {t.imageCaption}
              </figcaption>
            </figure>
          </HeroFade>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface">
        <dl className="container-site grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {dict.home.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="py-10 lg:px-8 lg:first:pl-0">
                <dt className="label text-muted">{s.label}</dt>
                <dd className="mt-2 font-mono text-3xl font-semibold">
                  {s.value}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Story */}
      <section className="border-b border-line">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <p className="label text-accent">{t.story.label}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {t.story.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-muted">
              {t.story.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-line bg-surface">
        <div className="container-site py-16 lg:py-20">
          <Reveal className="max-w-2xl">
            <p className="label text-accent">{t.values.label}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.values.title}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-3">
            {t.values.items.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="h-full bg-paper p-8">
                    <Icon className="h-5 w-5 text-accent" aria-hidden />
                    <h3 className="mt-6 text-lg font-semibold tracking-tight">
                      {v.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {v.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band-dark text-paper">
        <div className="container-site flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight">
            {t.cta.title}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/cars`}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-paper"
            >
              {t.cta.browseCars}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex h-12 items-center rounded-md border border-paper/30 px-6 text-sm font-medium transition-colors hover:border-paper"
            >
              {t.cta.visit}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
