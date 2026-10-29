import { formatDate } from "@/lib/format";

// A date set in a 3 x 5 dot matrix ("29.10.26"), drawn as SVG so it needs no third font.
// Screen readers get the written date instead.

const GLYPHS: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  ".": ["0", "0", "0", "0", "1"],
};

/** ISO date (YYYY-MM-DD) as DD.MM.YY. */
function short(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y.slice(2)}`;
}

export function DotDate({ date, className }: { date: string; className?: string }) {
  const dots: { x: number; y: number }[] = [];
  let x = 0;
  for (const char of short(date)) {
    const rows = GLYPHS[char];
    rows.forEach((row, y) =>
      [...row].forEach((on, col) => {
        if (on === "1") dots.push({ x: x + col, y });
      }),
    );
    x += rows[0].length + 1;
  }
  const width = x - 1;
  return (
    <time dateTime={date} className={className}>
      <svg
        viewBox={`-0.5 -0.5 ${width} 5`}
        width={width * 3}
        height={15}
        aria-hidden="true"
        focusable="false"
      >
        {dots.map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={0.36} fill="currentColor" />
        ))}
      </svg>
      <span className="sr-only">{formatDate(date)}</span>
    </time>
  );
}
