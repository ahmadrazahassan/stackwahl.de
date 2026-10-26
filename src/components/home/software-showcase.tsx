import { CardRail, CardRailItem } from "@/components/marketing/card-rail";
import { SoftwareCard } from "@/components/software/software-card";
import { ArrowLink } from "@/components/ui/button";
import {
  SegmentedContent,
  SegmentedList,
  SegmentedRoot,
  SegmentedTrigger,
} from "@/components/ui/segmented";
import type { ShowcaseTab } from "@/lib/content/home";

/** Tabbed card rail (home): one tab per category, cards in the explained price order. */
export function SoftwareShowcase({ tabs }: { tabs: ShowcaseTab[] }) {
  if (tabs.length === 0) return null;
  return (
    <SegmentedRoot defaultValue={tabs[0].slug}>
      <SegmentedList aria-label="Kategorie wählen">
        {tabs.map((tab) => (
          <SegmentedTrigger key={tab.slug} value={tab.slug}>
            {tab.label}
            <span className="ml-2 tabular">{tab.total}</span>
          </SegmentedTrigger>
        ))}
      </SegmentedList>
      {tabs.map((tab) => (
        <SegmentedContent key={tab.slug} value={tab.slug} className="mt-8">
          <CardRail label={`${tab.label}, sortiert nach Einstiegspreis`}>
            {tab.items.map((software) => (
              <CardRailItem key={software.slug}>
                <SoftwareCard software={software} />
              </CardRailItem>
            ))}
          </CardRail>
          <div className="-mt-11 flex min-h-11 flex-wrap items-center gap-x-6 gap-y-2 pr-28">
            <ArrowLink href={tab.href}>
              Alle {tab.total} Programme der Kategorie {tab.label}
            </ArrowLink>
          </div>
        </SegmentedContent>
      ))}
    </SegmentedRoot>
  );
}
