"use client";

import { ExternalLink } from "lucide-react";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Field, Input, Select } from "@/components/ui/form";
import { computeCost } from "@/lib/costs";
import { formatDate, formatEuro } from "@/lib/format";
import type { CalculatorProduct } from "@/lib/content/calculator-types";

const BILLINGS = ["monatlich", "jährlich"] as const;
const PERIODS = [12, 24, 36];

/** List-price calculator; inputs live in the URL so a calculation can be shared. */
export function CostCalculator({ products }: { products: CalculatorProduct[] }) {
  const [state, setState] = useQueryStates(
    {
      software: parseAsString.withDefault(products[0]?.slug ?? ""),
      tarif: parseAsInteger.withDefault(0),
      zahlweise: parseAsStringLiteral(BILLINGS).withDefault("monatlich"),
      nutzer: parseAsInteger.withDefault(1),
      monate: parseAsInteger.withDefault(12),
    },
    { history: "replace" },
  );

  const product = products.find((p) => p.slug === state.software) ?? products[0];
  if (!product) return null;
  const plan = product.plans[Math.min(state.tarif, product.plans.length - 1)];
  const users = Math.min(Math.max(state.nutzer, 1), 500);
  const months = PERIODS.includes(state.monate) ? state.monate : 12;
  const offered = BILLINGS.filter((b) =>
    b === "monatlich" ? plan?.monthlyCents !== null : plan?.yearlyMonthlyCents !== null,
  );
  const billing = offered.includes(state.zahlweise) ? state.zahlweise : offered[0];
  const result = plan && billing ? computeCost({ plan, billing, users, months }) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <Field label="Software">
          {({ id }) => (
            <Select
              id={id}
              value={product.slug}
              onChange={(e) => setState({ software: e.target.value, tarif: 0 })}
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Tarif">
          {({ id }) => (
            <Select
              id={id}
              value={String(product.plans.indexOf(plan))}
              onChange={(e) => setState({ tarif: Number(e.target.value) })}
            >
              {product.plans.map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          label="Zahlweise"
          hint={
            offered.length < 2 ? "Dieser Tarif wird nur mit einer Zahlweise angeboten." : undefined
          }
        >
          {({ id, describedBy }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              value={billing}
              onChange={(e) => setState({ zahlweise: e.target.value as (typeof BILLINGS)[number] })}
            >
              {offered.map((b) => (
                <option key={b} value={b}>
                  {b === "monatlich" ? "Monatliche Zahlung" : "Jährliche Zahlung"}
                </option>
              ))}
            </Select>
          )}
        </Field>
        {plan?.perUser ? (
          <Field label="Anzahl Nutzer">
            {({ id }) => (
              <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={1}
                max={500}
                value={users}
                onChange={(e) => setState({ nutzer: Number(e.target.value) || 1 })}
              />
            )}
          </Field>
        ) : null}
        <Field label="Zeitraum">
          {({ id }) => (
            <Select
              id={id}
              value={String(months)}
              onChange={(e) => setState({ monate: Number(e.target.value) })}
            >
              {PERIODS.map((m) => (
                <option key={m} value={m}>
                  {m} Monate
                </option>
              ))}
            </Select>
          )}
        </Field>
      </form>

      <section
        aria-labelledby="ergebnis-titel"
        aria-live="polite"
        className="flex flex-col gap-6 rounded-card bg-bg p-6 sm:p-8"
      >
        <h2 id="ergebnis-titel" className="eyebrow text-muted">
          Ergebnis
        </h2>
        {result && plan ? (
          <>
            <dl className="flex flex-col">
              <div className="flex items-baseline justify-between gap-6 border-t border-line py-3">
                <dt className="text-small text-muted">Pro Monat netto</dt>
                <dd className="font-display text-h3 font-medium tabular">
                  {formatEuro(result.perMonth.net)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-t border-line py-3">
                <dt className="text-small text-muted">{months} Monate netto</dt>
                <dd className="font-display text-h2 leading-none font-medium tabular">
                  {formatEuro(result.total.net)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-t border-line py-3">
                <dt className="text-small text-muted">{months} Monate brutto (19 % USt.)</dt>
                <dd className="text-body font-medium tabular">{formatEuro(result.total.gross)}</dd>
              </div>
            </dl>
            <p className="text-small text-muted">
              Listenpreis {plan.net ? "zzgl." : "inkl."} MwSt.
              {plan.perUser
                ? `, ${Math.max(users, plan.minUsers ?? 1)} Nutzer${plan.minUsers && users < plan.minUsers ? ` (Mindestabnahme des Anbieters)` : ""}`
                : ", Pauschalpreis unabhängig von der Nutzerzahl"}
              . Zusatzmodule und weitere Nutzer über das Tarifkontingent hinaus sind nicht
              eingerechnet.
              {plan.note ? ` ${plan.note}` : ""}
            </p>
            <p className="text-small text-muted">
              Preisstand {formatDate(plan.checkedAt)} ·{" "}
              <a
                href={plan.sourceUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-1 underline decoration-1 underline-offset-4 hover:text-ink"
              >
                Preisquelle
                <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
            </p>
          </>
        ) : (
          <p className="text-small text-muted">Für diese Auswahl liegt kein Preis vor.</p>
        )}
      </section>
    </div>
  );
}
