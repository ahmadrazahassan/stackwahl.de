import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDate, formatEuro } from "@/lib/format";
import type { PricePlan } from "./types";

/** Plan cards with monthly and yearly price, net/gross note, date and source. */
export function PriceTable({ plans, className }: { plans: PricePlan[]; className?: string }) {
  return (
    <ul className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {plans.map((plan) => (
        <li
          key={plan.name}
          className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6"
        >
          <div>
            <h3 className="text-h3">{plan.name}</h3>
            <p className="mt-4 font-display text-h2 leading-none font-medium tabular">
              {plan.monthlyCents === null ? "Auf Anfrage" : formatEuro(plan.monthlyCents)}
              {plan.monthlyCents !== null ? (
                <span className="ml-2 align-middle font-body text-small font-normal tracking-normal text-muted">
                  / Monat{plan.perUser ? " je Nutzer" : ""}
                </span>
              ) : null}
            </p>
            <p className="mt-2 text-small text-muted">
              {plan.net ? "zzgl. MwSt." : "inkl. MwSt."}
              {plan.yearlyCents !== null
                ? ` · jährlich ${formatEuro(plan.yearlyCents)}${plan.perUser ? " je Nutzer" : ""}`
                : ""}
            </p>
          </div>
          <ul className="flex flex-col gap-2 border-t border-line pt-4 text-small">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  strokeWidth={1.75}
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-auto text-small text-muted">
            Stand {formatDate(plan.checkedAt)} ·{" "}
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
        </li>
      ))}
    </ul>
  );
}
