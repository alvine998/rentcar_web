import Link from "next/link";
import { CarFront } from "lucide-react";

export default function NotFound() {
  return (
    <section className="hero-bg flex min-h-[70vh] items-center justify-center border-b border-line px-6 py-20">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-accent text-white">
          <CarFront className="h-6 w-6" aria-hidden />
        </span>
        <p className="label mt-6 text-accent">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Halaman tidak ditemukan · Page not found · 页面不存在
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you are looking for may have been moved or never existed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/id"
            className="inline-flex h-11 items-center rounded-md bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            Indonesia
          </Link>
          <Link
            href="/en"
            className="inline-flex h-11 items-center rounded-md border border-line bg-surface px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent-strong"
          >
            English
          </Link>
          <Link
            href="/zh"
            className="inline-flex h-11 items-center rounded-md border border-line bg-surface px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent-strong"
          >
            中文
          </Link>
        </div>
      </div>
    </section>
  );
}
