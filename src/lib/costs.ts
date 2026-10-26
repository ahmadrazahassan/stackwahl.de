// Cost overview for pricing pages: list prices over 12 and 36 months, net and gross.
// Pure functions in integer cents.

export const VAT_RATE = 0.19;

export type CostPlan = {
  monthlyCents: number | null;
  yearlyMonthlyCents: number | null;
  net: boolean;
};

export type CostLine = {
  billing: "monatlich" | "jährlich";
  months12: { net: number; gross: number };
  months36: { net: number; gross: number };
};

/** Converts a price to net and gross cents, whichever way the vendor states it. */
export function netGross(cents: number, isNet: boolean): { net: number; gross: number } {
  if (isNet) return { net: cents, gross: Math.round(cents * (1 + VAT_RATE)) };
  return { net: Math.round(cents / (1 + VAT_RATE)), gross: cents };
}

export function costOverview(plan: CostPlan): CostLine[] {
  const lines: CostLine[] = [];
  const add = (billing: CostLine["billing"], perMonth: number | null) => {
    if (perMonth === null) return;
    lines.push({
      billing,
      months12: netGross(perMonth * 12, plan.net),
      months36: netGross(perMonth * 36, plan.net),
    });
  };
  add("monatlich", plan.monthlyCents);
  add("jährlich", plan.yearlyMonthlyCents);
  return lines;
}

/** Saving of yearly over monthly billing per year, or null when one is missing. */
export function yearlySaving(plan: CostPlan): number | null {
  if (plan.monthlyCents === null || plan.yearlyMonthlyCents === null) return null;
  return (plan.monthlyCents - plan.yearlyMonthlyCents) * 12;
}

export type CostInput = {
  plan: CostPlan & { perUser: boolean; minUsers?: number };
  billing: "monatlich" | "jährlich";
  users: number;
  months: number;
};

export type CostResult = {
  perMonth: { net: number; gross: number };
  total: { net: number; gross: number };
};

/** Total cost of a plan for a period. null when the plan is not offered with that billing. */
export function computeCost({ plan, billing, users, months }: CostInput): CostResult | null {
  const perMonthCents = billing === "monatlich" ? plan.monthlyCents : plan.yearlyMonthlyCents;
  if (perMonthCents === null) return null;
  if (!Number.isInteger(users) || users < 1) throw new Error(`Ungültige Nutzerzahl: ${users}`);
  if (!Number.isInteger(months) || months < 1) throw new Error(`Ungültige Laufzeit: ${months}`);
  // Per-user plans are billed for at least the minimum number of seats the vendor sells.
  const seats = plan.perUser ? Math.max(users, plan.minUsers ?? 1) : 1;
  return {
    perMonth: netGross(perMonthCents * seats, plan.net),
    total: netGross(perMonthCents * seats * months, plan.net),
  };
}
