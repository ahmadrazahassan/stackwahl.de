"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { ComparisonTable, type ComparisonGroup } from "@/components/software/comparison-table";
import { COMPLIANCE, COMPLIANCE_KEYS, FEATURES, FEATURE_KEYS } from "@/content/features";
import type { FactStatus } from "@/content/schemas";
import { cn } from "@/lib/cn";
import type { FinderProduct } from "@/lib/finder";
import { formatEuro } from "@/lib/format";

const MAX = 3;

const label: Record<FactStatus, string> = {
  ja: "ja",
  nein: "nein",
  teilweise: "teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

/** Pick two or three tools; the selection lives in the URL (?software=a,b,c). */
export function ComparisonTool({ products }: { products: FinderProduct[] }) {
  const [selected, setSelected] = useQueryState(
    "software",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: "replace" }),
  );
  const chosen = selected
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is FinderProduct => p !== undefined)
    .slice(0, MAX);

  const toggle = (slug: string) => {
    const isChosen = chosen.some((p) => p.slug === slug);
    if (isChosen) setSelected(chosen.filter((p) => p.slug !== slug).map((p) => p.slug));
    else if (chosen.length < MAX) setSelected([...chosen.map((p) => p.slug), slug]);
  };

  const groups: ComparisonGroup[] = [
    {
      title: "Preise und Test",
      rows: [
        {
          label: "Einstiegspreis netto pro Monat",
          values: chosen.map((p) =>
            p.entryPriceCents === null ? "Auf Anfrage" : formatEuro(p.entryPriceCents),
          ),
        },
        { label: "Kostenloser Tarif", values: chosen.map((p) => (p.freePlan ? "ja" : "nein")) },
        {
          label: "Kostenlose Testphase",
          values: chosen.map((p) => (p.freeTrialDays ? `${p.freeTrialDays} Tage` : "Keine Angabe")),
        },
      ],
    },
    {
      title: "Rechtssicherheit",
      rows: COMPLIANCE_KEYS.map((k) => ({
        label: COMPLIANCE[k].label,
        values: chosen.map((p) => label[p.compliance[k]]),
      })),
    },
    {
      title: "Funktionen",
      rows: FEATURE_KEYS.map((k) => ({
        label: FEATURES[k].label,
        values: chosen.map((p) => label[p.features[k] ?? "unbekannt"]),
      })).filter((row) => row.values.some((v) => v !== "Keine Angabe")),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <fieldset>
        <legend className="text-h3">Programme auswählen</legend>
        <p className="mt-2 text-small text-muted" aria-live="polite">
          {chosen.length} von {MAX} ausgewählt
          {chosen.length < 2 ? ". Wählen Sie mindestens zwei Programme." : "."}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {products.map((p) => {
            const isChosen = chosen.some((c) => c.slug === p.slug);
            const disabled = !isChosen && chosen.length >= MAX;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  aria-pressed={isChosen}
                  disabled={disabled}
                  onClick={() => toggle(p.slug)}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-pill border px-4 text-small font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    isChosen
                      ? "border-primary bg-primary text-surface"
                      : "border-line bg-surface hover:border-ink",
                  )}
                >
                  {p.name}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>
      {chosen.length >= 2 ? (
        <ComparisonTable
          caption={`Vergleich: ${chosen.map((p) => p.name).join(", ")}`}
          products={chosen.map((p) => p.name)}
          groups={groups}
        />
      ) : null}
    </div>
  );
}
