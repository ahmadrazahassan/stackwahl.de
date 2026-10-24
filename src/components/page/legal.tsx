import { isPlaceholder } from "@/lib/placeholders";
import { siteConfig } from "@/site.config";

/**
 * A value from site.config. Open placeholders are shown as a clearly marked gap, never as
 * invented data (Section 0 and 3.2). These are the only placeholders allowed on public pages.
 */
export function ConfigValue({ value }: { value: string | null }) {
  if (value === null) return null;
  if (isPlaceholder(value)) {
    const name = value.slice(2, -2);
    return (
      <span className="rounded-[0.375rem] border border-dashed border-negative px-1.5 py-0.5 text-small text-negative">
        Angabe fehlt: {name}
      </span>
    );
  }
  return <>{value}</>;
}

/** Shown on every legal page until a lawyer has reviewed the texts (Section 9). */
export function LegalDraftNotice() {
  if (siteConfig.features.legalReviewed) return null;
  return (
    <p className="rounded-card border border-dashed border-negative p-4 text-small text-negative">
      Entwurf: Dieser Text ist noch nicht anwaltlich geprüft und wird vor dem Start der Website
      überarbeitet.
    </p>
  );
}
