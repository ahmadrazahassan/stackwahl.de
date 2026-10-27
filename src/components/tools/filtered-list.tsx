"use client";

import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from "nuqs";
import { SoftwareCard } from "@/components/software/software-card";
import type { SoftwareSummary } from "@/components/software/types";
import { cn } from "@/lib/cn";
import { applyFilters, FILTER_KEYS, FILTERS, type Filterable } from "@/lib/filters";

export type FilterableSoftware = Filterable & { summary: SoftwareSummary };

/** Category list with filters in the URL (?filter=datev,elster). Order stays as ranked. */
export function FilteredList({ items }: { items: FilterableSoftware[] }) {
  const [active, setActive] = useQueryState(
    "filter",
    parseAsArrayOf(parseAsStringLiteral(FILTER_KEYS))
      .withDefault([])
      .withOptions({ history: "replace" }),
  );
  const visible = applyFilters(items, active);

  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="eyebrow text-muted">Filtern</legend>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FILTER_KEYS.map((key) => {
            const on = active.includes(key);
            return (
              <li key={key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(on ? active.filter((k) => k !== key) : [...active, key])}
                  className={cn(
                    "inline-flex min-h-11 items-center border px-4 text-small font-medium transition-colors",
                    on
                      ? "border-primary bg-primary text-surface"
                      : "border-line bg-surface hover:border-ink",
                  )}
                >
                  {FILTERS[key]}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-small text-muted" aria-live="polite">
          {visible.length} von {items.length} Programmen. Ein Filter zählt nur, was der Anbieter
          nachweislich angibt.
          {active.length > 0 ? (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setActive([])}
                className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:text-ink"
              >
                Filter zurücksetzen
              </button>
            </>
          ) : null}
        </p>
      </fieldset>
      {visible.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <li key={item.slug}>
              <SoftwareCard software={item.summary} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body text-muted">
          Kein Programm erfüllt alle gewählten Filter nachweislich.
        </p>
      )}
    </div>
  );
}
