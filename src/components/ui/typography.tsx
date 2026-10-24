import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase label with a square primary marker: "■ UNSERE METHODIK". */
export function Eyebrow({
  className,
  marker = "primary",
  children,
  ...props
}: ComponentProps<"p"> & { marker?: "primary" | "current" }) {
  return (
    <p className={cn("flex items-center gap-2 eyebrow", className)} {...props}>
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0", marker === "primary" ? "bg-primary" : "bg-current")}
      />
      {children}
    </p>
  );
}

const headingSizes = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

/**
 * Headline whose last words are set in the muted tone for emphasis without color
 * ("Die richtige Software. **Unabhängig verglichen.**").
 */
export function Headline<T extends ElementType = "h2">({
  as,
  size = "h2",
  tail,
  tailTone = "muted",
  className,
  children,
  ...props
}: {
  as?: T;
  size?: keyof typeof headingSizes;
  tail?: ReactNode;
  tailTone?: "muted" | "soft";
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<T>, "as" | "className" | "children">) {
  const Component: ElementType = as ?? "h2";
  return (
    <Component className={cn(headingSizes[size], "font-display font-medium", className)} {...props}>
      {children}
      {tail ? (
        <>
          {" "}
          <span className={tailTone === "muted" ? "text-muted" : "opacity-60"}>{tail}</span>
        </>
      ) : null}
    </Component>
  );
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("max-w-[62ch] text-lead text-muted", className)} {...props} />;
}

/** Long form text block: 60 to 72 characters per line. */
export function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-[68ch] space-y-5 text-body [&_a]:text-primary [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_strong]:font-semibold",
        className,
      )}
      {...props}
    />
  );
}
