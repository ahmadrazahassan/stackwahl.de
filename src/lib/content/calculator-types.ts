// Client-safe type for the cost calculator data (src/lib/content/index.ts is server-only).

export type CalculatorProduct = {
  slug: string;
  name: string;
  plans: Array<{
    name: string;
    monthlyCents: number | null;
    yearlyMonthlyCents: number | null;
    perUser: boolean;
    net: boolean;
    note?: string;
    sourceUrl: string;
    checkedAt: string;
  }>;
};
