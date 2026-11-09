import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/lib/i18n/config";

const ADMIN_SESSION_COOKIE = "admin_session";
const PACKAGE_SLUGS = ["regular", "premium", "vip"];

function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && hasLocale(cookie)) return cookie;

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2);
    if (code === "zh") return "zh";
    if (code === "en") return "en";
    if (code === "id" || code === "ms") return "id";
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin console — no locale prefix, gated by session cookie
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const loggedIn = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "1";

    if (pathname === "/admin/login") {
      if (loggedIn) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return;
    }

    if (!loggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (pathname === "/admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
    return;
  }

  // Unknown package slugs redirect to the package index (avoids soft-404s)
  const pkgMatch = pathname.match(/^\/(?:id|en|zh)\/package\/([^/]+)\/?$/);
  if (pkgMatch && !PACKAGE_SLUGS.includes(pkgMatch[1])) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/package\/[^/]+\/?$/, "/package");
    return NextResponse.redirect(url);
  }

  // Public site — redirect to the preferred locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${getLocale(request)}${
    pathname === "/" ? "" : pathname
  }`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
