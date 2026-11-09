"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CarFront,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
} from "lucide-react";
import { clearAdminSession } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Fleet", icon: CarFront },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/packages", label: "Packages", icon: Package },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/cars": "Fleet Management",
  "/admin/bookings": "Booking Management",
  "/admin/packages": "Package Management",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function logout() {
    clearAdminSession();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-ink text-paper lg:flex">
        <div className="flex items-center gap-2.5 border-b border-paper/10 px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center bg-paper text-ink">
            <CarFront className="h-5 w-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[0.14em]">
              NUSA RENTCAR
            </p>
            <p className="label text-paper/50">Admin console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Admin">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-paper/10 text-paper"
                    : "text-paper/60 hover:bg-paper/5 hover:text-paper"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-accent"
                  />
                )}
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-paper">
              A
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">Admin</p>
              <p className="truncate text-xs text-paper/50">
                admin@nusarentcar.id
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 rounded-md border border-paper/15 px-3 py-2 text-sm text-paper/70 transition-colors hover:border-paper/40 hover:text-paper"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-6">
            <h1 className="text-lg font-semibold tracking-tight">
              {PAGE_TITLES[pathname] ?? "Admin"}
            </h1>
            <div className="flex items-center gap-2">
              <Link
                href="/id"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                View website
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-ink px-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent lg:hidden"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <nav
            className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 lg:hidden"
            aria-label="Admin mobile"
          >
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-ink text-paper"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 px-6 py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
