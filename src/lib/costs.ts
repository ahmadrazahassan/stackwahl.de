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
