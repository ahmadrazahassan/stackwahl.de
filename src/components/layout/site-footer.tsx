import Link from "next/link";
import { StackMark } from "@/components/brand/wordmark";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";
import { legalNav, type NavLink } from "./navigation";

/** Footer panel on ink with navigation columns and the giant wordmark (reference 1). */
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
  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="@container overflow-hidden rounded-[1.25rem] bg-ink text-surface sm:rounded-panel">
        <div className="grid gap-12 px-6 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-[24ch] font-display text-h3 font-normal tracking-[-0.02em]">
              Unabhängige Vergleiche von Business-Software für Deutschland, mit Quelle für jede
              Angabe.
            </p>
            {/* Site-wide commission notice; each affiliate link carries its own label as well. */}
            <p className="mt-6 max-w-[48ch] text-small">
              Stackwahl kann eine Provision erhalten, wenn Sie über einen Link zu einem Anbieter
              einen Vertrag abschließen. Ihr Preis ändert sich dadurch nicht, Wertung und
              Reihenfolge auch nicht.{" "}
              <Link
                href={routes.transparency()}
                className="underline decoration-1 underline-offset-4"
              >
                So finanzieren wir uns
              </Link>
            </p>
          </div>
          <nav
            aria-label="Fußzeile"
            className="grid gap-10 sm:grid-cols-2 lg:col-span-7 xl:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="eyebrow">{column.title}</h2>
                <ul className="mt-4 flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-small underline-offset-4 hover:underline"
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
        <div className="relative z-10 mt-16 flex flex-col gap-4 border-t border-muted px-6 py-6 text-small sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>
            © {year} {siteConfig.legal.ownerName}, {siteConfig.brand.name}
            {siteConfig.social.linkedinCompany ? (
              <>
                {" · "}
                <a
                  href={siteConfig.social.linkedinCompany}
                  target="_blank"
                  rel="noopener"
                  className="underline-offset-4 hover:underline"
                >
                  LinkedIn<span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              </>
            ) : null}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Decorative: the glyphs reach above the line box, so they must never take clicks. */}
        <div
          aria-hidden="true"
          className="pointer-events-none flex items-end gap-[1.5cqw] px-4 pb-2 select-none sm:px-8"
        >
          <StackMark className="mb-[2.2cqw] size-[11cqw] shrink-0 text-surface" />
          <span className="font-display text-[19.6cqw] leading-[0.78] font-medium tracking-[-0.055em]">
            Stackwahl
          </span>
        </div>
      </div>
    </footer>
  );
}
