"use client";

import { Check, ChevronDown } from "lucide-react";
import { Checkbox as CheckboxPrimitive, Switch as SwitchPrimitive } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "min-h-12 w-full rounded-control border border-line bg-surface px-4 text-body text-ink transition-colors duration-200 placeholder:text-muted hover:border-muted focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 aria-invalid:border-negative";

/**
 * Label, hint and error wired with `aria-describedby` (Section 8, forms).
 * The render prop receives the ids for the control.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hinweis` : undefined;
  const errorId = error ? `${id}-fehler` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint ? (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-small font-medium text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea className={cn(control, "min-h-32 py-3 leading-relaxed", className)} {...props} />
  );
}

/** Native select: best keyboard, screen reader and mobile support. */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(control, "appearance-none pr-11", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & { label: string; description?: string }) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <CheckboxPrimitive.Root
        id={id}
        aria-describedby={description ? `${id}-beschreibung` : undefined}
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[0.375rem] border border-muted bg-surface text-surface transition-colors hover:border-ink data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden="true" className="size-4" strokeWidth={2} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="min-h-6 text-body text-ink">
          {label}
        </label>
        {description ? (
          <p id={`${id}-beschreibung`} className="text-small text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Switch({
  label,
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & { label: string }) {
  const id = useId();
  return (
    <div className={cn("inline-flex min-h-11 items-center gap-3", className)}>
      <SwitchPrimitive.Root
        id={id}
        className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-pill bg-muted transition-colors duration-200 data-[state=checked]:bg-primary"
        {...props}
      >
        <SwitchPrimitive.Thumb className="block size-5 translate-x-1 rounded-pill bg-surface transition-transform duration-200 ease-out data-[state=checked]:translate-x-6" />
      </SwitchPrimitive.Root>
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
      </label>
    </div>
  );
}
