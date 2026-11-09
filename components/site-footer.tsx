import Link from "next/link";
import { CarFront, Clock, Mail, MapPin, Phone } from "lucide-react";
import { formatRupiah } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/en";

export function SiteFooter({
  locale,
  footer,
  nav,
  perDay,
  packageItems,
}: {
  locale: Locale;
  footer: Dictionary["footer"];
  nav: Dictionary["nav"];
  perDay: string;
  packageItems: { slug: string; name: string; priceFrom: number }[];
}) {
  return (
    <footer className="band-dark text-paper">
      <div className="container-site py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center bg-paper text-ink">
                <CarFront className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-semibold tracking-[0.14em]">
                NUSA RENTCAR
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
              {footer.description}
            </p>
          </div>

          <div>
            <p className="label text-paper/50">{footer.explore}</p>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: `/${locale}`, label: nav.home },
                { href: `/${locale}/package`, label: nav.package },
                { href: `/${locale}/cars`, label: nav.listCar },
                { href: `/${locale}/about`, label: nav.about },
                { href: `/${locale}/contact`, label: nav.contact },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-paper/50">{footer.packages}</p>
            <ul className="mt-4 space-y-2.5">
              {packageItems.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${locale}/package/${p.slug}`}
                    className="text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {p.name} — {nav.from} {formatRupiah(p.priceFrom)}{perDay}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-paper/50">{footer.contact}</p>
            <ul className="mt-4 space-y-3 text-sm text-paper/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-paper/50" aria-hidden />
                <span>
                  {footer.addressLine1}
                  <br />
                  {footer.addressLine2}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-paper/50" aria-hidden />
                <a href="tel:+622172088456" className="hover:text-paper">
                  {footer.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-paper/50" aria-hidden />
                <a href="mailto:halo@nusarentcar.id" className="hover:text-paper">
                  {footer.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-paper/50" aria-hidden />
                <span>{footer.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Nusa Rentcar. {footer.rights}</p>
          <p>{footer.photoCredit}</p>
        </div>
      </div>
    </footer>
  );
}
