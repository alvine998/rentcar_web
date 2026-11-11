import type { Metadata } from "next";
import "../globals.css";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = {
  title: {
    default: "Admin Console",
    template: "%s — Nusa Rentcar Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-paper text-ink">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
