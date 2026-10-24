"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type ProfileSection = { id: string; label: string };

/**
 * Sticky in-page navigation with scroll spy (Section 13.6.9). It is a list of links to
 * sections on the same page, so it uses `aria-current`, not the tabs role.
 */
export function ProfileTabs({
  sections,
  className,
}: {
  sections: ProfileSection[];
  className?: string;
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Abschnitte des Testberichts"
      className={cn("sticky top-0 z-30 border-b border-line bg-surface", className)}
    >
      <ul className="relative flex [scrollbar-width:none] gap-1 overflow-x-auto px-1">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative flex min-h-12 items-center px-4 text-small font-medium whitespace-nowrap transition-colors duration-200",
                  isActive ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {section.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-4 -bottom-px h-0.5 origin-left bg-primary transition-transform duration-300 ease-out",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
