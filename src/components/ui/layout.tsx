import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Max 1360 px content width with the 16 px mobile and 24 px desktop gutter. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[85rem] px-4 sm:px-6", className)} {...props} />;
}

const panelTones = {
  surface: "bg-surface text-ink",
  bg: "bg-bg text-ink",
  ink: "bg-ink text-surface",
  primary: "bg-primary text-surface",
} as const;

export type PanelTone = keyof typeof panelTones;

/**
 * Large rounded section panel that floats on the page background with a small inset
 * (reference 1). Use `as="section"` with an `aria-labelledby` for landmark sections.
 */
export function Panel<T extends ElementType = "div">({
  as,
  tone = "surface",
  className,
  ...props
}: { as?: T; tone?: PanelTone; className?: string; children?: ReactNode } & Omit<
  ComponentProps<T>,
  "as" | "className"
>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={cn("mx-3 rounded-[1.25rem] sm:mx-4 sm:rounded-panel", panelTones[tone], className)}
      {...props}
    />
  );
}

/** Vertical rhythm for page sections: 64 to 96 px mobile, 96 to 160 px desktop. */
export function Section({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("py-16 sm:py-24 lg:py-32", className)} {...props} />;
}

/** Asymmetric 12 column split: label in columns 1 to 3, content in columns 5 to 12. */
export function SplitGrid({
  aside,
  children,
  className,
}: {
  aside: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-6", className)}>
      <div className="lg:col-span-3">{aside}</div>
      <div className="lg:col-span-8 lg:col-start-5">{children}</div>
    </div>
  );
}
