import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDate, formatEuro } from "@/lib/format";
import type { PricePlan } from "./types";

function PriceLine({
  label,
  cents,
  perUser,
}: {
  label: string;
  cents: number | null;
  perUser: boolean;
}) {
  if (cents === null) {
    return (
      <div className="flex items-baseline justify-between gap-4 border-t border-line py-3 text-small">
        <dt className="text-muted">{label}</dt>
        <dd className="text-muted">nicht angeboten</dd>
      </div>
    );
  }
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
      <dt className="text-small text-muted">{label}</dt>
      <dd className="text-right">
        <span className="font-display text-h3 leading-none font-medium tabular">
          {formatEuro(cents)}
        </span>
        <span className="ml-1 text-small text-muted">/ Monat{perUser ? " je Nutzer" : ""}</span>
      </dd>
    </div>
  );
}

/** Plan cards with monthly and yearly billing, net/gross note, date, source and promo note. */
export function PriceTable({ plans, className }: { plans: PricePlan[]; className?: string }) {
  return (
    <ul className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {plans.map((plan) => (
        <li
          key={plan.name}
          className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6"
        >
          <div>
            <h3 className="text-h3">{plan.name}</h3>
            <p className="mt-1 text-small text-muted">
              {plan.net ? "Preise zzgl. MwSt." : "Preise inkl. MwSt."}
            </p>
          </div>
          <dl>
            <PriceLine
              label="Monatliche Zahlung"
              cents={plan.monthlyCents}
              perUser={plan.perUser}
            />
            <PriceLine
              label="Jährliche Zahlung"
              cents={plan.yearlyMonthlyCents}
              perUser={plan.perUser}
            />
          </dl>
          <ul className="flex flex-col gap-2 text-small">
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
          {plan.note ? <p className="bg-bg p-3 text-small text-muted">{plan.note}</p> : null}
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
