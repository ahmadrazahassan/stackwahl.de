import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/** Two columns; plus and minus marks plus text, never color alone (Section 13.6.7). */
export function ProsCons({
  pros,
  cons,
  className,
}: {
  pros: string[];
  cons: string[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-10 md:grid-cols-2 md:gap-6", className)}>
      <List title="Vorteile" items={pros} kind="pro" />
      <List title="Nachteile" items={cons} kind="con" />
    </div>
  );
}

function List({ title, items, kind }: { title: string; items: string[]; kind: "pro" | "con" }) {
  const Icon = kind === "pro" ? Plus : Minus;
  return (
    <div>
      <h3 className="eyebrow text-muted">{title}</h3>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 border-t border-line py-4 text-body">
            <Icon
              aria-hidden="true"
              strokeWidth={1.75}
              className={cn(
                "mt-1 size-4 shrink-0",
                kind === "pro" ? "text-positive" : "text-negative",
              )}
            />
            <span>
              <span className="sr-only">{kind === "pro" ? "Vorteil: " : "Nachteil: "}</span>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
