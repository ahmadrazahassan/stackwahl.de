"use client";

import { Check, Minus, X } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/form";
import { cn } from "@/lib/cn";

export type ComparisonValue = "ja" | "nein" | "teilweise" | string;

export type ComparisonRow = { label: string; values: ComparisonValue[] };
export type ComparisonGroup = { title: string; rows: ComparisonRow[] };

function Cell({ value }: { value: ComparisonValue }) {
  if (value === "ja")
    return (
      <span className="inline-flex items-center gap-2">
        <Check aria-hidden="true" className="size-4 text-positive" strokeWidth={1.75} />
        Ja
      </span>
    );
  if (value === "nein")
    return (
      <span className="inline-flex items-center gap-2 text-muted">
        <X aria-hidden="true" className="size-4 text-negative" strokeWidth={1.75} />
        Nein
      </span>
    );
  if (value === "teilweise")
    return (
      <span className="inline-flex items-center gap-2">
        <Minus aria-hidden="true" className="size-4" strokeWidth={1.75} />
        Teilweise
      </span>
    );
  return <span>{value}</span>;
}

export function isDifferent(row: ComparisonRow): boolean {
  return new Set(row.values).size > 1;
}

/**
 * Side by side comparison (Section 13.6.10): sticky product header and first column,
 * "Unterschiede hervorheben" marks rows whose values differ (bar and bold label, not color only).
 */
export function ComparisonTable({
  products,
  groups,
  caption,
  className,
}: {
  products: string[];
  groups: ComparisonGroup[];
  caption: string;
  className?: string;
}) {
  const [highlight, setHighlight] = useState(false);
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Switch label="Unterschiede hervorheben" checked={highlight} onCheckedChange={setHighlight} />
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="relative max-h-[36rem] overflow-auto rounded-card border border-line bg-surface"
      >
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-small">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 left-0 z-20 border-b border-line bg-surface p-4 text-left"
              >
                <span className="sr-only">Kriterium</span>
              </th>
              {products.map((product) => (
                <th
                  key={product}
                  scope="col"
                  className="sticky top-0 z-10 border-b border-line bg-surface p-4 text-left font-display text-h3 font-medium"
                >
                  {product}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={products.length + 1}
                  className="sticky left-0 bg-bg px-4 py-3 text-left eyebrow font-medium text-muted"
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row) => {
                const marked = highlight && isDifferent(row);
                return (
                  <tr key={row.label} data-different={marked || undefined}>
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 border-b border-line bg-surface p-4 text-left font-normal",
                        marked && "font-semibold shadow-[inset_3px_0_0_var(--color-primary)]",
                      )}
                    >
                      {row.label}
                      {marked ? <span className="sr-only"> (unterschiedlich)</span> : null}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${products[index]}`}
                        className={cn("border-b border-line p-4", marked && "bg-primary-tint")}
                      >
                        <Cell value={value} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
