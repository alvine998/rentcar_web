import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { HeroFade, Reveal } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import { CARS, PACKAGES } from "@/lib/data";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { businessJsonLd, pageMetadata } from "@/lib/seo";

const CHANNEL_ICONS = [Phone, MessageCircle, Mail, Clock];
const CHANNEL_HREFS = [
  "tel:+622172088456",
  "https://wa.me/6281288456620",
  "mailto:halo@nusarentcar.id",
  "tel:+6281288456621",
];

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/contact",
    title: dict.contact.label,
    description: dict.contact.description,
    image: "/cars/hrv.jpg",
  });
}

export default async function ContactPage(
  props: PageProps<"/[locale]/contact">,
) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.contact;

  return (
    <>
      <JsonLd data={businessJsonLd()} />

      {/* Hero */}
      <section className="hero-bg border-b border-line bg-surface">
        <div className="container-site py-16 lg:py-20">
          <HeroFade>
            <p className="label text-accent">{t.label}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {t.description}
            </p>
          </HeroFade>
        </div>
      </section>

      {/* Form + details */}
      <section className="border-b border-line">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.25fr_1fr] lg:py-20">
          <div>
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t.form.title}
              </h2>
              <p className="mt-2 text-muted">{t.form.description}</p>
              <div className="mt-8">
                <BookingForm form={t.form} packages={PACKAGES} cars={CARS} />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t.otherWays}
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {t.channels.map((c, i) => {
                const Icon = CHANNEL_ICONS[i];
                return (
                  <li key={c.label} className="py-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface">
                        <Icon className="h-4.5 w-4.5 text-accent" aria-hidden />
                      </span>
                      <div>
                        <p className="label text-muted">{c.label}</p>
                        <a
                          href={CHANNEL_HREFS[i]}
                          className="mt-1 block font-medium hover:text-accent"
                        >
                          {c.value}
                        </a>
                        <p className="mt-1 text-sm text-muted">{c.detail}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-xl border border-line bg-surface p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
                  <MapPin className="h-4.5 w-4.5 text-accent" aria-hidden />
                </span>
                <div>
                  <p className="label text-muted">{t.office.label}</p>
                  <p className="mt-1 leading-relaxed">
                    {t.office.line1}
                    <br />
                    {t.office.line2}
                  </p>
                  <p className="mt-2 text-sm text-muted">{t.office.note}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
