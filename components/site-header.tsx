"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { CarFront, ChevronDown, Menu, X } from "lucide-react";
import { formatRupiah } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/en";
import { LanguageSwitcher } from "@/components/language-switcher";

type PackageItem = {
  slug: string;
  name: string;
  tagline: string;
  priceFrom: number;
};

export function SiteHeader({
  locale,
  nav,
  brandLine,
  packageItems,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  brandLine: string;
  packageItems: PackageItem[];
}) {
  const pathname = usePathname();
  const [openPackages, setOpenPackages] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMobile(false);
    setOpenPackages(false);
  }

  function openPackagesNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenPackages(true);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenPackages(false), 120);
  }

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/cars`, label: nav.listCar },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  const packageActive =
    pathname === `/${locale}/package` ||
    pathname.startsWith(`/${locale}/package/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-ink text-paper">
            <CarFront className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-[0.14em]">
              NUSA RENTCAR
            </span>
            <span className="label block text-muted">{brandLine}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <NavLink
            href={`/${locale}`}
            active={pathname === `/${locale}`}
            label={nav.home}
          />

          <div
            className="relative"
            onMouseEnter={openPackagesNow}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={openPackages}
              aria-haspopup="true"
              onClick={() => setOpenPackages((v) => !v)}
              className={`relative flex h-9 items-center gap-1.5 px-3 text-sm transition-colors ${
                packageActive ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {nav.package}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${openPackages ? "rotate-180" : ""}`}
                aria-hidden
              />
              {packageActive && <ActiveBar id="nav-underline" />}
            </button>

            <AnimatePresence>
              {openPackages && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full w-[23rem] border border-line bg-surface shadow-[0_24px_50px_-28px_rgba(20,18,16,0.4)]"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="label text-muted">{nav.packagesLabel}</p>
                  </div>
                  <ul>
                    {packageItems.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/${locale}/package/${p.slug}`}
                          className="block px-4 py-3 transition-colors hover:bg-paper"
                        >
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-sm font-medium">{p.name}</span>
                            <span className="font-mono text-xs text-muted">
                              {nav.from} {formatRupiah(p.priceFrom)}/day
                            </span>
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {p.tagline}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/package`}
                    className="block border-t border-line bg-paper px-4 py-3 text-sm text-accent transition-colors hover:text-accent-strong"
                  >
                    {nav.compareAll} &rarr;
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.slice(1).map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={pathname === item.href}
              label={item.label}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/contact`}
            className="hidden h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-accent sm:inline-flex"
          >
            {nav.bookNow}
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line lg:hidden"
            aria-label={openMobile ? nav.closeMenu : nav.openMenu}
            onClick={() => setOpenMobile((v) => !v)}
          >
            {openMobile ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
      />

      <AnimatePresence>
        {openMobile && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
            aria-label="Mobile"
          >
            <div className="container-site py-4">
              <ul className="divide-y divide-line">
                <MobileItem
                  href={`/${locale}`}
                  active={pathname === `/${locale}`}
                  label={nav.home}
                />
                <li className="py-3">
                  <p className="label mb-2 text-muted">{nav.packagesLabel}</p>
                  <ul className="space-y-1">
                    {packageItems.map((p) => (
                      <li key={p.slug}>
                        <MobileItem
                          href={`/${locale}/package/${p.slug}`}
                          active={pathname === `/${locale}/package/${p.slug}`}
                          label={p.name}
                          indent
                        />
                      </li>
                    ))}
                    <li>
                      <MobileItem
                        href={`/${locale}/package`}
                        active={pathname === `/${locale}/package`}
                        label={nav.compareAll}
                        indent
                      />
                    </li>
                  </ul>
                </li>
                {links.slice(1).map((item) => (
                  <li key={item.href}>
                    <MobileItem
                      href={item.href}
                      active={pathname === item.href}
                      label={item.label}
                    />
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/contact`}
                className="mt-4 flex h-11 items-center justify-center rounded-md bg-ink text-sm font-medium text-paper"
              >
                {nav.bookNow}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function ActiveBar({ id }: { id: string }) {
  return (
    <motion.span
      layoutId={id}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-3 -bottom-[13px] h-px bg-ink"
    />
  );
}

function NavLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`relative flex h-9 items-center px-3 text-sm transition-colors ${
        active ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {label}
      {active && <ActiveBar id="nav-underline" />}
    </Link>
  );
}

function MobileItem({
  href,
  active,
  label,
  indent,
}: {
  href: string;
  active: boolean;
  label: string;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block py-2 text-sm ${indent ? "pl-3" : ""} ${
        active ? "font-medium text-ink" : "text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
