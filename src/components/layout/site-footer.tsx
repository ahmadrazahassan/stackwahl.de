import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GermanFlag } from "@/components/ui/german-flag";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";
import { legalNav, type NavLink } from "./navigation";

/**
 * Footer: one white card. A question with one link on the left, the link columns on the
 * right (small grey heading, larger links), a hairline and the company line with the legal
 * links at the bottom.
 */
export function SiteFooter({
  categories,
  columns: navColumns,
  year,
}: {
  categories: NavLink[];
  columns: { title: string; links: NavLink[] }[];
  year: number;
}) {
  const columns = [
    ...(categories.length > 0 ? [{ title: "Kategorien", links: categories }] : []),
    ...navColumns,
  ];
  const { legal, social, features } = siteConfig;
  return (
    <footer className="px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4">
      <div className="rounded-[1.25rem] bg-surface px-6 pt-12 text-ink sm:rounded-panel sm:px-10 sm:pt-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-[18ch] font-display text-h3 font-normal tracking-[-0.02em]">
              Welche Software passt zu Ihrem Betrieb?
            </p>
            <Link
              href={features.finder ? routes.finder() : routes.categories()}
              className="mt-6 inline-flex min-h-11 items-center gap-8 border-b border-line text-body transition-colors hover:border-ink"
            >
              {features.finder ? "Software-Finder starten" : "Kategorien ansehen"}
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </Link>
            <p className="mt-10 flex items-center gap-2 text-small text-muted">
              <GermanFlag />
              Recherchiert für den deutschen Markt
            </p>
            {/* Site-wide commission notice; each affiliate link carries its own label as well. */}
            <p className="mt-3 max-w-[46ch] text-small text-muted">
              Stackwahl kann eine Provision erhalten, wenn Sie über einen Link zu einem Anbieter
              einen Vertrag abschließen. Ihr Preis ändert sich dadurch nicht, Wertung und
              Reihenfolge auch nicht.{" "}
              <Link
                href={routes.transparency()}
                className="text-ink underline decoration-1 underline-offset-4"
              >
                So finanzieren wir uns
              </Link>
            </p>
          </div>

          <nav
            aria-label="Fußzeile"
            className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-small text-muted">{column.title}</h2>
                <ul className="mt-3 flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-body transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line py-6 text-small sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2">
            <span>
              © {year} {legal.companyName}
            </span>
            <span className="inline-flex items-center gap-2 text-muted">
              <GermanFlag />
              {legal.city}, Deutschland
            </span>
            {social.linkedinCompany ? (
              <a
                href={social.linkedinCompany}
                target="_blank"
                rel="noopener"
                className="text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                LinkedIn<span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
            ) : null}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
