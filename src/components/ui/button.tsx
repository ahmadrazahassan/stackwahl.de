import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Split button (Section 13.6.1): a label body joined to a square segment that holds a thin
// arrow. The segment is part of the button shape, never a badge behind an icon.

const button = cva(
  "group/button inline-flex min-h-11 items-stretch rounded-control text-small font-medium transition-colors duration-200 ease-out select-none focus-visible:outline-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-surface hover:bg-primary-hover",
        dark: "bg-ink text-surface",
        outline:
          "bg-transparent text-ink ring-1 ring-ink ring-inset hover:bg-ink hover:text-surface",
        light: "bg-surface text-ink hover:bg-bg",
      },
      size: {
        md: "",
        lg: "min-h-12 text-body",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

const segment = cva(
  "flex w-11 shrink-0 items-center justify-center rounded-r-control transition-colors duration-200 ease-out",
  {
    variants: {
      variant: {
        primary: "border-l border-primary-hover group-hover/button:border-primary",
        dark: "bg-primary group-hover/button:bg-primary-hover",
        outline: "border-l border-ink group-hover/button:border-surface",
        light: "border-l border-line",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonStyle = VariantProps<typeof button> & {
  /** "next" for internal steps, "external" for links that leave the site. */
  arrow?: "next" | "external" | "none";
};

function ButtonInner({
  children,
  arrow = "next",
  variant,
}: {
  children: ReactNode;
  arrow?: ButtonStyle["arrow"];
  variant: ButtonStyle["variant"];
}) {
  const Icon = arrow === "external" ? ArrowUpRight : ArrowRight;
  return (
    <>
      <span
        className={cn("flex flex-1 items-center px-5", arrow === "none" && "justify-center px-6")}
      >
        {children}
      </span>
      {arrow === "none" ? null : (
        <span aria-hidden="true" className={segment({ variant })}>
          <Icon
            className="size-4 transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
            strokeWidth={1.5}
          />
        </span>
      )}
    </>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...props
}: ButtonStyle & ComponentProps<"button">) {
  return (
    <button type={type} className={cn(button({ variant, size }), className)} {...props}>
      <ButtonInner arrow={arrow} variant={variant}>
        {children}
      </ButtonInner>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  arrow,
  className,
  children,
  ...props
}: ButtonStyle & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(button({ variant, size }), className)} {...props}>
      <ButtonInner arrow={arrow} variant={variant}>
        {children}
      </ButtonInner>
    </Link>
  );
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
      <ButtonInner arrow="external" variant={variant}>
        {children}
        <span className="sr-only"> (öffnet in neuem Tab)</span>
      </ButtonInner>
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
