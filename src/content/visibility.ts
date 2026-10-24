import type { Software } from "./schemas.ts";

// Production shows only published and verified content; dev shows drafts (Section 6).
// A preview build (pnpm build:preview, used by the E2E tests) also shows drafts. Both values are
// inlined at build time, so the static shell and request renders agree (pitfall 4.2).

export const SHOW_DRAFTS =
  process.env.NODE_ENV !== "production" || process.env.STACKWAHL_SHOW_DRAFTS === "1";

/** A category goes live only with at least this many visible profiles (docs/PLAN.md). */
export const MIN_PROFILES_PER_CATEGORY = 5;

export function isVisible(
  item: { status: "draft" | "published"; verification?: "verified" | "unverified" },
  showDrafts = SHOW_DRAFTS,
): boolean {
  if (showDrafts) return true;
  return item.status === "published" && (item.verification ?? "verified") === "verified";
}

export function visibleSoftware(all: Software[], showDrafts = SHOW_DRAFTS): Software[] {
  return all.filter((s) => isVisible(s, showDrafts));
}

/**
 * Lowest paid monthly price in cents across plans (yearly billing counts as monthly price).
 * Free plans are reported separately (Software.freePlan), so "ab" always means a paid tariff.
 */
export function entryPriceCents(software: Pick<Software, "plans">): number | null {
  const prices = software.plans.flatMap((p) =>
    [p.monthlyCents, p.yearlyMonthlyCents].filter((v): v is number => v !== null && v > 0),
  );
  return prices.length > 0 ? Math.min(...prices) : null;
}
