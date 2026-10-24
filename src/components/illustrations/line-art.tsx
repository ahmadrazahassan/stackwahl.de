import type { SVGProps } from "react";

// Custom fine line geometric illustrations drawn in code (Section 13.11): 1.5 px strokes in
// currentColor, no fills, no gradients. Decorative, so hidden from assistive technology.

type ArtProps = SVGProps<SVGSVGElement> & { size?: number };

function Art({ size = 96, children, ...props }: ArtProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Ray burst: many sources weighed into one view. Pillar "Unabhängig bewertet". */
export function RayBurst(props: ArtProps) {
  const rays = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const inner = i % 2 === 0 ? 12 : 20;
    return {
      x1: round(48 + Math.cos(a) * inner),
      y1: round(48 + Math.sin(a) * inner),
      x2: round(48 + Math.cos(a) * 44),
      y2: round(48 + Math.sin(a) * 44),
    };
  });
  return (
    <Art {...props}>
      {rays.map((r, i) => (
        <line key={i} {...r} />
      ))}
      <circle cx="48" cy="48" r="5" />
    </Art>
  );
}

/** Nested offset squares: a stack of rules. Pillar "Deutsche Rechtslage im Blick". */
export function NestedSquares(props: ArtProps) {
  return (
    <Art {...props}>
      {[0, 1, 2, 3, 4].map((i) => {
        const inset = 6 + i * 8;
        return (
          <rect
            key={i}
            x={inset}
            y={inset - i * 2}
            width={96 - inset * 2}
            height={96 - inset * 2}
            rx={2}
          />
        );
      })}
    </Art>
  );
}

/** Interlocking diamonds: requirements meeting a product. Pillar "Passend zu Ihrem Bedarf". */
export function Lattice(props: ArtProps) {
  const diamonds = [
    [48, 26],
    [30, 48],
    [66, 48],
    [48, 70],
    [48, 48],
  ];
  return (
    <Art {...props}>
      {diamonds.map(([cx, cy], i) => (
        <path
          key={i}
          d={`M${cx} ${cy - 20} L${cx + 20} ${cy} L${cx} ${cy + 20} L${cx - 20} ${cy} Z`}
        />
      ))}
    </Art>
  );
}

/** Stacked bars: the Stackwahl mark idea, also used for categories. */
export function StackLines(props: ArtProps) {
  return (
    <Art {...props}>
      {[22, 38, 54, 70].map((y, i) => (
        <rect key={y} x={14 + i * 4} y={y} width={68 - i * 8} height={8} rx={2} />
      ))}
    </Art>
  );
}

/** Concentric arcs: steps toward a decision. Used in the process section. */
export function Arcs(props: ArtProps) {
  return (
    <Art {...props}>
      {[12, 22, 32, 42].map((r) => (
        <path key={r} d={`M${48 - r} 84 A${r} ${r} 0 0 1 ${48 + r} 84`} />
      ))}
      <line x1="6" y1="84" x2="90" y2="84" />
    </Art>
  );
}

export const lineArt = { RayBurst, NestedSquares, Lattice, StackLines, Arcs };
