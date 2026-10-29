import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Plain rectangular button: square corners, a centered label, no icon segment.

const button = cva(
  "inline-flex min-h-11 items-center justify-center px-6 text-small font-medium transition-colors duration-200 ease-out select-none focus-visible:outline-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-ink hover:bg-accent-hover",
        dark: "bg-ink text-surface hover:bg-primary",
        outline:
          "bg-transparent text-ink ring-1 ring-ink ring-inset hover:bg-ink hover:text-surface",
        light: "bg-surface text-ink hover:bg-bg",
      },
      size: {
        md: "",
        lg: "min-h-12 px-7 text-body",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonStyle = VariantProps<typeof button>;

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonStyle & ComponentProps<"button">) {
  return <button type={type} className={cn(button({ variant, size }), className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonStyle & ComponentProps<typeof Link>) {
  return <Link className={cn(button({ variant, size }), className)} {...props} />;
}

/**
 * Commercial link to a vendor. Always labeled and always `rel="sponsored nofollow noopener"`
 * when it is an affiliate link (Section 3.4).
 */
export function VendorButton({
  href,
  affiliate,
  children,
  variant = "primary",
  size,
  className,
}: {
  href: string;
  affiliate: boolean;
  children: ReactNode;
  variant?: ButtonStyle["variant"];
  size?: ButtonStyle["size"];
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={affiliate ? "sponsored nofollow noopener" : "noopener"}
      className={cn(button({ variant, size }), className)}
    >
      {children}
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}

/** Quiet text link with an arrow, e.g. "Weiterlesen". */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group/link inline-flex min-h-11 items-center gap-2 text-small font-medium text-ink underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 text-primary transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}
