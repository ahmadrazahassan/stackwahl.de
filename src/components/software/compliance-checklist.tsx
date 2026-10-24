import { Check, ExternalLink, Minus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { ComplianceRow, ComplianceStatus } from "./types";

const statusMeta: Record<ComplianceStatus, { label: string; icon: typeof Check; tone: string }> = {
  ja: { label: "Ja", icon: Check, tone: "text-positive" },
  nein: { label: "Nein", icon: X, tone: "text-negative" },
  teilweise: { label: "Teilweise", icon: Minus, tone: "text-ink" },
  aufpreis: { label: "Gegen Aufpreis", icon: Minus, tone: "text-ink" },
};

/** Criterion, status, note and source (Section 13.6.8). */
export function ComplianceChecklist({
  rows,
  checkedAt,
  caption = "Rechtssicherheit in Deutschland",
  className,
}: {
  rows: ComplianceRow[];
  checkedAt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className={cn("relative overflow-x-auto", className)}
    >
      <table className="w-full min-w-[36rem] border-collapse text-small">
        <caption className="pb-4 text-left text-muted">
          {caption} · Stand {formatDate(checkedAt)}
        </caption>
        <thead>
          <tr className="text-left">
            <th scope="col" className="pb-3 eyebrow font-medium text-muted">
              Kriterium
            </th>
            <th scope="col" className="pb-3 eyebrow font-medium text-muted">
              Status
            </th>
            <th scope="col" className="pb-3 eyebrow font-medium text-muted">
              Hinweis
            </th>
            <th scope="col" className="pb-3 eyebrow font-medium text-muted">
              Quelle
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const meta = statusMeta[row.status];
            const Icon = meta.icon;
            return (
              <tr key={row.criterion} className="border-t border-line align-top">
                <th scope="row" className="py-4 pr-4 text-left font-medium">
                  {row.criterion}
                </th>
                <td className="py-4 pr-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className={cn("size-4", meta.tone)}
                    />
                    {meta.label}
                  </span>
                </td>
                <td className="py-4 pr-4 text-muted">{row.note ?? ""}</td>
                <td className="py-4">
                  {row.sourceUrl ? (
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-11 items-center gap-1 underline decoration-1 underline-offset-4 hover:text-primary"
                    >
                      {row.sourceLabel ?? "Quelle"}
                      <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                      <span className="sr-only"> (öffnet in neuem Tab)</span>
                    </a>
                  ) : (
                    <span className="text-muted">Keine Angabe</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
