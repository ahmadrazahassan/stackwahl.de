"use client";

import { Tabs } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Segmented pill control (reference 3). Built on Radix Tabs: arrow keys move between
// segments, Tab moves into the panel (WAI-ARIA tabs pattern).

export const SegmentedRoot = Tabs.Root;

export function SegmentedList({
  className,
  tone = "light",
  ...props
}: ComponentProps<typeof Tabs.List> & { tone?: "light" | "dark" }) {
  return (
    <Tabs.List
      className={cn(
        "relative inline-flex max-w-full [scrollbar-width:none] gap-1 overflow-x-auto rounded-pill p-1 ring-1 ring-inset",
        tone === "light" ? "bg-surface ring-line" : "bg-ink ring-muted",
        className,
      )}
      {...props}
    />
  );
}

export function SegmentedTrigger({
  className,
  tone = "light",
  ...props
}: ComponentProps<typeof Tabs.Trigger> & { tone?: "light" | "dark" }) {
  return (
    <Tabs.Trigger
      className={cn(
        "min-h-11 shrink-0 rounded-pill px-5 text-small font-medium whitespace-nowrap transition-colors duration-200 ease-out",
        tone === "light"
          ? "text-muted hover:text-ink data-[state=active]:bg-ink data-[state=active]:text-surface"
          : "text-surface hover:bg-ink data-[state=active]:bg-surface data-[state=active]:text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function SegmentedContent({ className, ...props }: ComponentProps<typeof Tabs.Content>) {
  return <Tabs.Content className={cn("outline-none", className)} {...props} />;
}
