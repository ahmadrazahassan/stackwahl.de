import { SHOW_DRAFTS } from "@/content/visibility";
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

/** An e-mail address as a mailto link; an open placeholder stays a marked gap. */
export function MailLink({ address, className }: { address: string; className?: string }) {
  if (isPlaceholder(address)) return <ConfigValue value={address} />;
  return (
    <a
      href={`mailto:${address}`}
      className={className ?? "underline decoration-1 underline-offset-4 hover:text-primary"}
    >
      {address}
    </a>
  );
}

/**
 * Internal reminder on every legal page until a lawyer has reviewed the texts (Section 9).
 * Only in development and preview builds; the review status is tracked in CONTENT_STATUS.
 */
export function LegalDraftNotice() {
  if (siteConfig.features.legalReviewed || !SHOW_DRAFTS) return null;
  return (
    <p className="rounded-card border border-dashed border-negative p-4 text-small text-negative">
      Entwurf: Dieser Text ist noch nicht anwaltlich geprüft und wird vor dem Start der Website
      überarbeitet.
    </p>
  );
}
