"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal card rail with scroll snap. Touch and trackpad scroll natively; the two outline
 * buttons move one card and are disabled at the ends. Without JavaScript the list still scrolls.
 */
export function CardRail({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = list.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const move = (direction: 1 | -1) => {
    const el = list.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={list}
        aria-label={label}
        className="relative -mx-1 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-1 pb-2"
      >
        {children}
      </ul>
      <div className="mt-6 flex justify-end gap-2">
        <RailButton label="Vorherige Programme" disabled={edges.start} onClick={() => move(-1)}>
          <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </RailButton>
        <RailButton label="Weitere Programme" disabled={edges.end} onClick={() => move(1)}>
          <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </RailButton>
      </div>
    </div>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center border border-line text-ink transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:text-muted disabled:hover:border-line"
    >
      {children}
    </button>
  );
}

/** One snap item of the rail, sized so that about three cards show on desktop. */
export function CardRailItem({ children }: { children: ReactNode }) {
  return <li className="w-[min(20rem,82vw)] shrink-0 snap-start sm:w-[22rem]">{children}</li>;
}
