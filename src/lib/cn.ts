import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge must know the custom tokens, otherwise it drops e.g. a line height
// placed before `text-h2` or treats `text-primary` and `text-h2` as conflicting.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "lead", "body", "small", "label"],
      radius: ["panel", "card", "control", "pill"],
      shadow: ["float"],
      color: [
        "primary",
        "primary-hover",
        "primary-tint",
        "ink",
        "bg",
        "surface",
        "muted",
        "line",
        "positive",
        "negative",
      ],
      font: ["display", "body"],
    },
    classGroups: {
      "fvn-spacing": ["tabular"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
