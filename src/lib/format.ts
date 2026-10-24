// German formatting for money, dates and scores (docs/BUILD_PROMPT.md, Section 3.1).
// Money is stored as integer cents in euro, dates as ISO dates.

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const euroWhole = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const score = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});
const longDateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** 990 -> "9,90 €"; whole euros drop the decimals only when asked. */
export function formatEuro(cents: number, options: { whole?: boolean } = {}): string {
  if (!Number.isInteger(cents)) throw new Error(`Cent-Betrag muss ganzzahlig sein: ${cents}`);
  return (options.whole ? euroWhole : euro).format(cents / 100);
}

/** 8.43 -> "8,4" (one decimal, as the methodology requires). */
export function formatScore(value: number): string {
  if (value < 0 || value > 10) throw new Error(`Wertung außerhalb von 0 bis 10: ${value}`);
  return score.format(Math.round(value * 10) / 10);
}

/** 0.25 -> "25 %" */
export function formatPercent(value: number): string {
  return percent.format(value);
}

function parseIsoDate(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error(`Kein ISO-Datum: ${iso}`);
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
    throw new Error(`Ungültiges Datum: ${iso}`);
  }
  return date;
}

/** "2026-10-24" -> "24.10.2026" */
export function formatDate(iso: string): string {
  return dateFormat.format(parseIsoDate(iso));
}

/** "2026-10-24" -> "24. Oktober 2026" */
export function formatLongDate(iso: string): string {
  return longDateFormat.format(parseIsoDate(iso));
}

export type BillingPeriod = "monat" | "jahr";

/** Price line used on cards: "ab 9,90 € / Monat zzgl. MwSt." */
export function formatPriceFrom(
  cents: number,
  { period = "monat", net = true }: { period?: BillingPeriod; net?: boolean } = {},
): string {
  if (cents === 0) return "Kostenloser Tarif";
  const unit = period === "monat" ? "Monat" : "Jahr";
  return `ab ${formatEuro(cents)} / ${unit} ${net ? "zzgl. MwSt." : "inkl. MwSt."}`;
}
