"use client";

import { ButtonLink } from "@/components/ui/button";
import { MediaFrame, type RealImage } from "@/components/ui/media";
import {
  SegmentedContent,
  SegmentedList,
  SegmentedRoot,
  SegmentedTrigger,
} from "@/components/ui/segmented";
import { cn } from "@/lib/cn";

export type Step = {
  id: string;
  label: string;
  title: string;
  text: string;
  image?: RealImage;
  cta?: { label: string; href: string };
};

const fields = [
  "bg-primary text-surface",
  "bg-primary-tint text-ink",
  "bg-surface text-ink",
  "bg-ink text-surface",
];

/**
 * Process section (reference 3): numbered segmented control that switches large cards with a
 * flat color field and a real image.
 */
export function StepCards({
  steps,
  label,
  className,
}: {
  steps: Step[];
  label: string;
  className?: string;
}) {
  return (
    <SegmentedRoot defaultValue={steps[0]?.id} className={cn("flex flex-col gap-8", className)}>
      <SegmentedList aria-label={label} tone="dark" className="self-start">
        {steps.map((step, index) => (
          <SegmentedTrigger key={step.id} value={step.id} tone="dark">
            <span className="tabular">{String(index + 1).padStart(2, "0")}</span> {step.label}
          </SegmentedTrigger>
        ))}
      </SegmentedList>
      {steps.map((step, index) => (
        <SegmentedContent key={step.id} value={step.id}>
          <div
            className={cn(
              "grid overflow-hidden rounded-card md:grid-cols-2",
              fields[index % fields.length],
            )}
          >
            <div className="flex min-h-[22rem] flex-col justify-between gap-10 p-6 sm:p-10">
              <p className="eyebrow">
                <span className="tabular">{String(index + 1).padStart(2, "0")}</span> {step.label}
              </p>
              <div>
                <h3 className="max-w-[18ch] text-h2 uppercase">{step.title}</h3>
                <p className="mt-4 max-w-[44ch] text-body">{step.text}</p>
                {step.cta ? (
                  <ButtonLink
                    href={step.cta.href}
                    variant={index % fields.length === 0 ? "light" : "dark"}
                    className="mt-8"
                  >
                    {step.cta.label}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <div className="p-3 md:p-4">
              <MediaFrame
                image={step.image}
                className="h-full min-h-64"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </div>
        </SegmentedContent>
      ))}
    </SegmentedRoot>
  );
}
