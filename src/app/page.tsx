import { siteConfig } from "@/site.config";

// Phase 0 foundation page. The real home page is built in Phase 3 from the approved
// information architecture (docs/PLAN.md).
export default function HomePage() {
  return (
    <main id="inhalt" className="p-3 sm:p-4">
      <section className="rounded-panel bg-surface px-6 py-24 sm:px-12 sm:py-32">
        <p className="flex items-center gap-2 eyebrow text-muted">
          <span aria-hidden="true" className="size-1.5 bg-primary" />
          Business-Software für Deutschland
        </p>
        <h1 className="mt-6 max-w-[14ch] text-display">
          {siteConfig.brand.name}. <span className="text-muted">Unabhängig verglichen.</span>
        </h1>
        <p className="mt-8 max-w-[60ch] text-lead text-muted">
          Testberichte, Preise und Vergleiche für Buchhaltung, Rechnungen, ERP und CRM, mit Blick
          auf GoBD, E-Rechnung und DATEV.
        </p>
      </section>
    </main>
  );
}
