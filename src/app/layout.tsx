import type { Metadata, Viewport } from "next";
import { googleSansFlex, inter } from "@/fonts/fonts";
import { siteConfig } from "@/site.config";
import "./globals.css";

const { brand, features } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name}: ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Unabhängige Vergleiche von Business-Software für Unternehmen in Deutschland: Funktionen, Preise, Vor- und Nachteile, mit Quelle für jede Angabe.",
  applicationName: brand.name,
  // Indexing stays off until launch (docs/BUILD_PROMPT.md, Section 11 and Phase 7).
  robots: features.indexing ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: brand.name,
    title: `${brand.name}: ${brand.tagline}`,
    description:
      "Unabhängige Vergleiche von Business-Software für Unternehmen in Deutschland: Funktionen, Preise, Vor- und Nachteile, mit Quelle für jede Angabe.",
    url: brand.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f1f1f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={brand.language} className={`${googleSansFlex.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#inhalt"
          className="sr-only rounded-control bg-ink px-4 py-3 text-small text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Zum Inhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
