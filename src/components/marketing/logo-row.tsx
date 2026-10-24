import Image from "next/image";
import { cn } from "@/lib/cn";

export type VendorLogo = { name: string; src: string; width: number; height: number };

/**
 * Row of real vendor logos in grayscale, labeled "Bewertete Software" (never "Partner" or
 * "Bekannt aus"). Logos come only from official press kits (docs/LOGOS.md).
 */
export function LogoRow({ logos, className }: { logos: VendorLogo[]; className?: string }) {
  if (logos.length === 0) return null;
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10", className)}>
      <p className="shrink-0 eyebrow text-muted">Bewertete Software</p>
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">
        {logos.map((logo) => (
          <li key={logo.name}>
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className="h-7 w-auto opacity-70 grayscale transition-opacity hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
