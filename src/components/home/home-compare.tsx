"use client";

import { Check, CircleHelp, Minus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLink, ButtonLink, VendorButton } from "@/components/ui/button";
import { Select, Switch } from "@/components/ui/form";
import { DisclosureLabel } from "@/components/ui/labels";
import type { FactStatus } from "@/content/schemas";
import { cn } from "@/lib/cn";
import type { ComparePreset, CompareProduct, CompareRowKey } from "@/lib/content/compare-types";
import { formatEuro, formatScore } from "@/lib/format";
import { routes } from "@/lib/routes";

// Home page comparison (Section 13.7): two or three programs side by side with price, trial,
// free plan, the German compliance facts and the most asked features. Highlights are computed
// from the data only ("günstigster Einstieg" is the lowest net entry price), never from
// commissions. The full matrix with every fact stays on /vergleich. From md up the rows form a
// table; below, every row is a label with the two or three values side by side.

const FACT_ROWS: { title: string; rows: { key: CompareRowKey; label: string }[] }[] = [
  {
    title: "Rechtssicherheit",
    rows: [
      { key: "eRechnungVersand", label: "E-Rechnung erstellen und senden" },
      { key: "eRechnungEmpfang", label: "E-Rechnung empfangen" },
      { key: "elster", label: "Umsatzsteuer-Voranmeldung per ELSTER" },
      { key: "datevExport", label: "DATEV-Export oder -Schnittstelle" },
      { key: "gobd", label: "GoBD-konforme Archivierung" },
      { key: "serverstandort", label: "Server in Deutschland oder der EU" },
    ],
  },
  {
    title: "Funktionen",
    rows: [
      { key: "angebote", label: "Angebote" },
      { key: "mahnwesen", label: "Mahnwesen" },
      { key: "belegerfassungOcr", label: "Belegerfassung per Foto (OCR)" },
      { key: "bankabgleich", label: "Bankabgleich" },
      { key: "euer", label: "Einnahmen-Überschuss-Rechnung" },
      { key: "bilanz", label: "Bilanz und doppelte Buchführung" },
      { key: "lohn", label: "Lohnabrechnung" },
      { key: "lager", label: "Lager und Warenwirtschaft" },
      { key: "steuerberaterzugang", label: "Zugang für die Steuerberatung" },
      { key: "mobileApp", label: "Mobile App" },
    ],
  },
];

const STATUS: Record<FactStatus, string> = {
  ja: "Ja",
  nein: "Nein",
  teilweise: "Teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

type Cell = { slug: string; node: ReactNode; highlight?: boolean };
type Row = { id: string; label: string; cells: Cell[] };
type Section = { title: string; rows: Row[] };

function Status({ value }: { value: FactStatus }) {
  const icon = { "aria-hidden": true, strokeWidth: 1.75, className: "size-4 shrink-0" } as const;
  return (
    <span className={cn("inline-flex items-center gap-2", value === "unbekannt" && "text-muted")}>
      {value === "ja" ? <Check {...icon} className={cn(icon.className, "text-positive")} /> : null}
      {value === "nein" ? <X {...icon} className={cn(icon.className, "text-negative")} /> : null}
      {value === "teilweise" || value === "aufpreis" ? <Minus {...icon} /> : null}
      {value === "unbekannt" ? <CircleHelp {...icon} /> : null}
      {STATUS[value]}
    </span>
  );
}

function priceLabel(p: CompareProduct): string {
  if (!p.entry) return "Preis auf Anfrage";
  const unit =
    p.entry.seats > 1 ? ` für ${p.entry.seats} Nutzer` : p.entry.perUser ? " je Nutzer" : "";
  return `${formatEuro(p.entry.cents)}${unit}`;
}

/**
 * Slugs of the products that share the best value. Products without a value (price on request,
 * trial not stated) are skipped; the summary then says that the others give no value.
 */
function best(
  products: CompareProduct[],
  value: (p: CompareProduct) => number | null,
  low: boolean,
) {
  const values = products.map(value).filter((v): v is number => v !== null);
  if (values.length === 0) return new Set<string>();
  const target = low ? Math.min(...values) : Math.max(...values);
  return new Set(products.filter((p) => value(p) === target).map((p) => p.slug));
}

const names = (products: CompareProduct[], slugs: Set<string>) =>
  products
    .filter((p) => slugs.has(p.slug))
    .map((p) => p.name)
    .join(", ");

export function HomeCompare({
  products,
  presets,
  initial,
  picker = true,
}: {
  products: CompareProduct[];
  presets: ComparePreset[];
  initial: string[];
  /** false on editorial comparison pages, where the programs are fixed. */
  picker?: boolean;
}) {
  const [slugs, setSlugs] = useState<string[]>(initial);
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const chosen = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is CompareProduct => p !== undefined);

  const setSlot = (index: number, slug: string) => {
    const next = [...slugs];
    if (slug === "") next.splice(index, 1);
    else next[index] = slug;
    setSlugs(next.filter((s, i) => next.indexOf(s) === i));
  };

  const cheapest = best(chosen, (p) => p.entry?.cents ?? null, true);
  const longestTrial = best(chosen, (p) => p.freeTrialDays, false);
  const topScore = best(chosen, (p) => p.research, false);
  const freePlans = chosen.filter((p) => p.freePlan);
  const unpriced = chosen.some((p) => !p.entry);
  const untested = chosen.some((p) => !p.freeTrialDays);
  // Per-user and flat prices are only comparable for one user; the summary says so.
  const mixedUnits = new Set(chosen.map((p) => Boolean(p.entry?.perUser))).size > 1;

  const sections: Section[] = [
    {
      title: "Preis und Test",
      rows: [
        {
          id: "preis",
          label: "Einstiegspreis netto pro Monat",
          cells: chosen.map((p) => ({
            slug: p.slug,
            highlight: cheapest.has(p.slug),
            node: (
              <>
                <span className="font-medium tabular">{priceLabel(p)}</span>
                {p.entry ? <span className="block text-muted">Tarif {p.entry.plan}</span> : null}
                <Link
                  href={p.pricingHref}
                  className="mt-1 inline-block text-muted underline decoration-1 underline-offset-4 hover:text-ink"
                >
                  Alle Tarife<span className="sr-only"> von {p.name}</span>
                </Link>
              </>
            ),
          })),
        },
        {
          id: "gratis",
          label: "Kostenloser Tarif",
          cells: chosen.map((p) => ({
            slug: p.slug,
            node: <Status value={p.freePlan ? "ja" : "nein"} />,
          })),
        },
        {
          id: "test",
          label: "Kostenlose Testphase",
          cells: chosen.map((p) => ({
            slug: p.slug,
            highlight: longestTrial.has(p.slug),
            node: p.freeTrialDays ? (
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" strokeWidth={1.75} className="size-4 text-positive" />
                {p.freeTrialDays} Tage
              </span>
            ) : (
              <Status value="unbekannt" />
            ),
          })),
        },
        {
          id: "wertung",
          label: "Recherche-Wertung",
          cells: chosen.map((p) => ({
            slug: p.slug,
            highlight: topScore.has(p.slug),
            node:
              p.research !== null ? (
                <span className="font-medium tabular">{formatScore(p.research)} von 10</span>
              ) : (
                <span className="text-muted">Noch nicht bewertet</span>
              ),
          })),
        },
      ],
    },
    ...FACT_ROWS.map((group) => ({
      title: group.title,
      rows: group.rows
        .filter((r) => !onlyDifferences || new Set(chosen.map((p) => p.facts[r.key])).size > 1)
        .map((r) => ({
          id: r.key,
          label: r.label,
          cells: chosen.map((p) => ({ slug: p.slug, node: <Status value={p.facts[r.key]} /> })),
        })),
    })),
  ].filter((section) => section.rows.length > 0);

  const badges = (p: CompareProduct) => [
    ...(cheapest.has(p.slug) ? ["Günstigster Einstieg"] : []),
    ...(longestTrial.has(p.slug) ? ["Längste Testphase"] : []),
    ...(topScore.has(p.slug) ? ["Höchste Recherche-Wertung"] : []),
  ];
  const caption = `Vergleich: ${chosen.map((p) => p.name).join(", ")}`;
  const cols = chosen.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="flex flex-col gap-8">
      {picker ? (
        <div className="flex flex-col gap-6 rounded-card bg-bg p-5 sm:p-6">
          <div>
            <p className="text-small font-medium">Schnellauswahl</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {presets.map((preset) => {
                const active = preset.slugs.join() === slugs.join();
                return (
                  <li key={preset.label}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSlugs(preset.slugs)}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-pill border px-4 text-small font-medium transition-colors",
                        active
                          ? "border-primary bg-primary text-surface"
                          : "border-line bg-surface hover:border-ink",
                      )}
                    >
                      {preset.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <fieldset className="grid gap-4 sm:grid-cols-3">
            <legend className="sr-only">Programme für den Vergleich wählen</legend>
            {[0, 1, 2].map((index) => (
              <label key={index} className="flex flex-col gap-2 text-small font-medium">
                {index === 2 ? "Programm 3 (optional)" : `Programm ${index + 1}`}
                <Select
                  value={slugs[index] ?? ""}
                  onChange={(e) => setSlot(index, e.target.value)}
                  disabled={index === 2 && slugs.length < 2}
                >
                  {index >= 1 ? <option value="">Kein Programm</option> : null}
                  {products.map((p) => (
                    <option
                      key={p.slug}
                      value={p.slug}
                      disabled={slugs.includes(p.slug) && slugs[index] !== p.slug}
                    >
                      {p.name}
                    </option>
                  ))}
                </Select>
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}

      {chosen.length < 2 ? (
        <p className="text-small text-muted" aria-live="polite">
          Wählen Sie mindestens zwei Programme.
        </p>
      ) : (
        <>
          <ul aria-live="polite" className="grid gap-3 sm:grid-cols-3">
            <Highlight
              title="Günstigster Einstieg"
              value={cheapest.size > 0 ? names(chosen, cheapest) : "Nicht vergleichbar"}
              detail={
                cheapest.size > 0
                  ? `ab ${priceLabel(chosen.find((p) => cheapest.has(p.slug))!)} netto im Monat${mixedUnits ? ", gerechnet für einen Nutzer" : ""}${unpriced ? ", andere Preise nur auf Anfrage" : ""}`
                  : "Preise nur auf Anfrage"
              }
            />
            <Highlight
              title="Längste Testphase"
              value={longestTrial.size > 0 ? names(chosen, longestTrial) : "Keine Angabe"}
              detail={
                longestTrial.size > 0
                  ? `${chosen.find((p) => longestTrial.has(p.slug))!.freeTrialDays} Tage kostenlos${untested ? ", bei den anderen keine Angabe" : ""}`
                  : "Kein Anbieter nennt eine Testphase"
              }
            />
            <Highlight
              title="Dauerhaft kostenlos"
              value={freePlans.length > 0 ? freePlans.map((p) => p.name).join(", ") : "Keines"}
              detail={freePlans.length > 0 ? "mit kostenlosem Tarif" : "Alle Tarife kosten Geld"}
            />
          </ul>

          <Switch
            label="Nur Unterschiede zeigen"
            checked={onlyDifferences}
            onCheckedChange={setOnlyDifferences}
          />

          {/* md and up: a table with one column per program. */}
          <div
            role="region"
            aria-label={caption}
            tabIndex={0}
            className="relative hidden overflow-x-auto rounded-card border border-line bg-surface md:block"
          >
            <table className="w-full table-fixed border-collapse text-small">
              <caption className="sr-only">
                {caption}. Preise netto pro Monat, Angaben der Anbieter mit Prüfdatum im Profil.
              </caption>
              <thead>
                <tr className="align-top">
                  <td className="w-[26%] p-4" />
                  {chosen.map((p) => (
                    <th
                      key={p.slug}
                      scope="col"
                      className="border-l border-line p-4 text-left font-normal"
                    >
                      <ProductHead product={p} badges={badges(p)} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.flatMap((section) => [
                  <tr key={section.title} className="border-t border-line bg-bg">
                    <th
                      colSpan={chosen.length + 1}
                      scope="colgroup"
                      className="px-4 py-2.5 text-left eyebrow text-muted"
                    >
                      {section.title}
                    </th>
                  </tr>,
                  ...section.rows.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <th scope="row" className="p-4 text-left align-top font-medium">
                        {row.label}
                      </th>
                      {row.cells.map((cell) => (
                        <td
                          key={cell.slug}
                          className={cn(
                            "border-l border-line p-4 align-top",
                            cell.highlight && "bg-primary-tint",
                          )}
                        >
                          {cell.node}
                        </td>
                      ))}
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>

          {/* Below md: product heads side by side, then each row as label plus values. */}
          <div className="flex flex-col gap-6 md:hidden" aria-label={caption} role="region">
            <ul className={cn("grid gap-3", cols)}>
              {chosen.map((p) => (
                <li key={p.slug} className="min-w-0 rounded-card border border-line p-3">
                  <ProductHead product={p} badges={badges(p)} compact />
                </li>
              ))}
            </ul>
            {sections.map((section) => (
              <section key={section.title} aria-label={section.title}>
                <h3 className="eyebrow text-muted">{section.title}</h3>
                <dl className="mt-2">
                  {section.rows.map((row) => (
                    <div key={row.id} className="border-t border-line py-3">
                      <dt className="text-small font-medium">{row.label}</dt>
                      <dd className={cn("mt-2 grid gap-3 text-small", cols)}>
                        {row.cells.map((cell, i) => (
                          <span
                            key={cell.slug}
                            className={cn(
                              "min-w-0 rounded-control px-2 py-1.5 break-words",
                              cell.highlight && "bg-primary-tint",
                            )}
                          >
                            <span className="sr-only">{chosen[i].name}: </span>
                            {cell.node}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="max-w-[62ch] text-small text-muted">
              „Keine Angabe“ heißt: Der Anbieter nennt es auf den geprüften Seiten nicht. Die
              Hinweise entstehen nur aus den Daten, Provisionen haben keinen Einfluss.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink
                href={`${routes.comparisonTool()}?software=${chosen.map((p) => p.slug).join(",")}`}
              >
                Alle Details vergleichen
              </ButtonLink>
              <ArrowLink href={routes.costCalculator()}>Kosten berechnen</ArrowLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Highlight({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <li className="rounded-card border border-line p-5">
      <p className="eyebrow text-muted">{title}</p>
      <p className="mt-2 text-h3">{value}</p>
      <p className="mt-1 text-small text-muted">{detail}</p>
    </li>
  );
}

function ProductHead({
  product: p,
  badges,
  compact = false,
}: {
  product: CompareProduct;
  badges: string[];
  compact?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={cn("flex items-center", compact ? "min-h-6" : "min-h-9")}>
        {p.logo ? (
          <Image
            src={p.logo.src}
            alt={p.logo.alt}
            width={p.logo.width}
            height={p.logo.height}
            className="object-contain object-left"
            style={{ height: compact ? 18 : 28, width: "auto", maxWidth: "min(100%, 140px)" }}
          />
        ) : null}
      </div>
      <div>
        <Link
          href={p.profileHref}
          className={cn(
            "font-display font-medium break-words underline-offset-4 hover:underline",
            compact ? "text-body" : "text-h3",
          )}
        >
          {p.name}
        </Link>
        {compact ? null : <p className="mt-1 text-muted">{p.category}</p>}
      </div>
      {badges.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Hinweise zu ${p.name}`}>
          {badges.map((b) => (
            <li
              key={b}
              className="rounded-pill bg-primary-tint px-2.5 py-1 text-[0.75rem] leading-tight font-medium text-primary"
            >
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-col gap-2">
        <VendorButton
          href={p.vendor.href}
          affiliate={p.vendor.affiliate}
          variant="dark"
          className="w-full"
        >
          {compact ? "Website" : "Website besuchen"}
          <span className="sr-only"> von {p.name}</span>
        </VendorButton>
        {compact ? null : <span className="text-muted">Weiter zu {p.vendor.host}</span>}
        {p.vendor.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
        <ButtonLink href={p.profileHref} variant="outline" arrow="none" className="w-full">
          {compact ? "Profil" : "Profil lesen"}
          <span className="sr-only"> zu {p.name}</span>
        </ButtonLink>
      </div>
    </div>
  );
}
