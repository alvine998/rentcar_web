import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarCatalog } from "@/components/car-catalog";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { CARS } from "@/lib/data";

export async function generateMetadata(
  props: PageProps<"/[locale]/cars">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/cars",
    title: dict.cars.label,
    description: dict.cars.description,
    image: "/cars/fortuner.jpg",
  });
}

export default async function CarsPage(props: PageProps<"/[locale]/cars">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: dict.cars.title,
          itemListElement: CARS.map((car, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: `${car.brand} ${car.name} ${car.year}`,
              image: `${SITE_URL}${car.image}`,
              offers: {
                "@type": "Offer",
                price: car.pricePerDay,
                priceCurrency: "IDR",
                availability: "https://schema.org/InStock",
              },
            },
          })),
        }}
      />

      <section className="hero-bg border-b border-line bg-surface">
        <div className="container-site py-16 lg:py-20">
          <Reveal>
            <p className="label text-accent">{dict.cars.label}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              {dict.cars.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {dict.cars.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-site py-14 lg:py-16">
          <CarCatalog locale={locale} common={dict.common} />
        </div>
      </section>
    </>
  );
}
