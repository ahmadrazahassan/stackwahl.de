import { Check, CircleHelp, ExternalLink, Minus, X } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSection } from "@/components/page/page-header";
import { ComplianceChecklist } from "@/components/software/compliance-checklist";
import { PriceTable } from "@/components/software/price-table";
import { ProfileMedia } from "@/components/software/profile-media";
import { ProfileReview } from "@/components/software/profile-review";
import { Breadcrumbs, ProfileHeader } from "@/components/software/profile-header";
import { ProfileTabs } from "@/components/software/profile-tabs";
import { ProsCons } from "@/components/software/pros-cons";
import { ResearchScoreBreakdown } from "@/components/software/research-score";
import { SoftwareCard } from "@/components/software/software-card";
import { ArrowLink } from "@/components/ui/button";
import { DemoNote } from "@/components/ui/labels";
import { Container, Panel } from "@/components/ui/layout";
import type { Fact, FactStatus } from "@/content/schemas";
import { SHOW_DRAFTS } from "@/content/visibility";
import { cn } from "@/lib/cn";
import {
  alternativesFor,
  factsCheckedAt,
  featureGroups,
  getAllSoftware,
  profileSources,
  staticSlugs,
  toComplianceRows,
  toPricePlans,
  toSummary,
  vendorLink,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { researchScore } from "@/lib/research-score";
import { routes } from "@/lib/routes";
import { loadProfile } from "./data";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getAllSoftware().map((s) => s.slug));
}

export async function generateMetadata({
  params,
}: PageProps<"/software/[slug]">): Promise<Metadata> {
  const data = loadProfile((await params).slug);
  if (!data) return {};
  const { software } = data;
  return {
    title: `${software.name}: Preise, Funktionen, Vor- und Nachteile`,
    description: software.summary,
    alternates: { canonical: routes.software(software.slug) },
  };
}

const allSections = [
  { id: "ueberblick", label: "Überblick" },
  { id: "wertung", label: "Wertung" },
  { id: "einblicke", label: "Bilder und Videos" },
  { id: "im-detail", label: "Im Detail" },
  { id: "funktionen", label: "Funktionen" },
  { id: "preise", label: "Preise" },
  { id: "vor-und-nachteile", label: "Vor- und Nachteile" },
  { id: "rechtssicherheit", label: "Rechtssicherheit" },
  { id: "alternativen", label: "Alternativen" },
  { id: "quellen", label: "Quellen" },
];

const statusText: Record<FactStatus, string> = {
  ja: "Ja",
  nein: "Nein",
  teilweise: "Teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

function StatusIcon({ status }: { status: FactStatus }) {
  const props = { "aria-hidden": true, strokeWidth: 1.75, className: "mt-0.5 size-4 shrink-0" };
  if (status === "ja") return <Check {...props} className={cn(props.className, "text-positive")} />;
  if (status === "nein") return <X {...props} className={cn(props.className, "text-negative")} />;
  if (status === "unbekannt")
    return <CircleHelp {...props} className={cn(props.className, "text-muted")} />;
  return <Minus {...props} />;
}

function FactLine({ label, fact }: { label: string; fact: Fact }) {
  return (
    <li className="flex gap-3 border-t border-line py-4">
      <StatusIcon status={fact.status} />
      <div>
        <p className="text-body">
          <span className="font-medium">{label}</span>
          <span className="text-muted">: {statusText[fact.status]}</span>
        </p>
        {fact.note ? <p className="mt-1 text-small text-muted">{fact.note}</p> : null}
      </div>
    </li>
  );
}

function yesNo(value: boolean | null) {
  return value === null ? "Keine Angabe" : value ? "Ja" : "Nein";
}

export default async function SoftwarePage({ params }: PageProps<"/software/[slug]">) {
  const data = loadProfile((await params).slug);
  if (!data) notFound();
  const { software, vendor, crumbs } = data;

  const summary = toSummary(software);
  const alternatives = alternativesFor(software);
  const sources = profileSources(software);
  const research = software.rating ? null : researchScore(software);
  const sections = allSections.filter(
    (s) =>
      (s.id !== "im-detail" || software.review) &&
      (s.id !== "wertung" || research) &&
      (s.id !== "einblicke" || software.screenshots.length + software.videos.length > 0) &&
      (s.id !== "alternativen" || alternatives.length > 0),
  );

  const facts: Array<[string, string]> = [
    [
      "Anbieter",
      vendor ? `${vendor.legalName}${vendor.city ? `, ${vendor.city}` : ""}` : software.vendor,
    ],
    [
      "Bereitstellung",
      software.deployment
        .map((d) => ({ cloud: "Cloud", desktop: "Desktop", hybrid: "Hybrid" })[d])
        .join(", "),
    ],
    ["Im Browser nutzbar", yesNo(software.apps.web)],
    ["App für iOS", yesNo(software.apps.ios)],
    ["App für Android", yesNo(software.apps.android)],
    ["Kostenloser Tarif", software.freePlan ? "Ja" : "Nein"],
    [
      "Kostenlose Testphase",
      software.freeTrialDays ? `${software.freeTrialDays} Tage` : "Keine Angabe",
    ],
    ["Zuletzt recherchiert", formatDate(software.lastReviewed)],
  ];

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <Panel>
        <Container className="pt-12 sm:pt-16">
          <Breadcrumbs
            items={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))}
          />
          {software.status === "draft" && SHOW_DRAFTS ? (
            <DemoNote className="mt-6">Entwurf, nicht veröffentlicht</DemoNote>
          ) : null}
          <ProfileHeader
            className="mt-10 pb-12"
            software={summary}
            summary={software.summary}
            vendorHref={vendorLink(software, "profil").href}
          />
        </Container>
        <ProfileTabs sections={sections} className="rounded-b-[1.25rem] sm:rounded-b-panel" />
      </Panel>

      <PageSection id="ueberblick" label="Überblick" title={`${software.name} auf einen Blick`}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="eyebrow text-muted">Geeignet für</h3>
              <ul className="mt-3 flex flex-col gap-2 text-body">
                {software.idealFor.map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="mt-1 size-4 shrink-0 text-positive"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow text-muted">Weniger geeignet für</h3>
              <ul className="mt-3 flex flex-col gap-2 text-body">
                {software.notIdealFor.map((t) => (
                  <li key={t} className="flex gap-3">
                    <Minus
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="mt-1 size-4 shrink-0 text-negative"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-card bg-bg p-5 text-small text-muted">
              Recherchiert auf den Seiten des Anbieters, Stand {formatDate(software.lastReviewed)}.
              Wir haben dieses Programm noch nicht in einem eigenen Konto ausprobiert.
            </p>
          </div>
          <dl className="text-body">
            {facts.map(([term, value]) => (
              <div key={term} className="flex justify-between gap-6 border-t border-line py-3">
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PageSection>

      {research ? (
        <PageSection
          id="wertung"
          label="Wertung"
          title={`So entsteht die Wertung für ${software.name}`}
        >
          <ResearchScoreBreakdown score={research} categoryName={summary.category} />
        </PageSection>
      ) : null}

      {software.screenshots.length + software.videos.length > 0 ? (
        <PageSection
          id="einblicke"
          label="Bilder und Videos"
          title={`${software.name} in Bildern und Videos`}
        >
          <ProfileMedia
            name={vendor?.name ?? software.name}
            screenshots={software.screenshots}
            videos={software.videos}
          />
        </PageSection>
      ) : null}

      {software.review ? (
        <PageSection id="im-detail" label="Im Detail" title={`${software.name} im Detail`}>
          <ProfileReview review={software.review} />
        </PageSection>
      ) : null}

      <PageSection id="funktionen" label="Funktionen" title="Was das Programm kann">
        <div className="grid gap-10 md:grid-cols-2">
          {featureGroups(software).map(({ group, items }) => (
            <div key={group}>
              <h3 className="eyebrow text-muted">{group}</h3>
              <ul className="mt-3">
                {items.map((item) => (
                  <FactLine key={item.key} label={item.label} fact={item.fact} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="preise" label="Preise" title={`Was ${software.name} kostet`}>
        <PriceTable plans={toPricePlans(software)} />
        <ArrowLink href={routes.softwarePricing(software.slug)} className="mt-6">
          Kosten über 12 und 36 Monate
        </ArrowLink>
      </PageSection>

      <PageSection id="vor-und-nachteile" label="Vor- und Nachteile" title="Stärken und Grenzen">
        <ProsCons pros={software.pros} cons={software.cons} />
      </PageSection>

      <PageSection
        id="rechtssicherheit"
        label="Rechtssicherheit"
        title="Für Unternehmen in Deutschland"
      >
        <ComplianceChecklist
          rows={toComplianceRows(software)}
          checkedAt={factsCheckedAt(software)}
        />
      </PageSection>

      {alternatives.length > 0 ? (
        <PageSection
          id="alternativen"
          label="Alternativen"
          title={`Alternativen zu ${software.name}`}
        >
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {alternatives.slice(0, 3).map((s) => (
              <li key={s.slug}>
                <SoftwareCard software={toSummary(s)} />
              </li>
            ))}
          </ul>
          <ArrowLink href={routes.softwareAlternatives(software.slug)} className="mt-6">
            Alle {alternatives.length} Alternativen vergleichen
          </ArrowLink>
        </PageSection>
      ) : null}

      <PageSection id="quellen" label="Quellen" title="Woher die Angaben stammen">
        <ul className="flex flex-col">
          {sources.map((source) => (
            <li
              key={source.url}
              className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-line py-3 text-small"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-1 font-medium underline decoration-1 underline-offset-4 hover:text-primary"
              >
                {source.title}
                <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
              <span className="text-muted">abgerufen am {formatDate(source.accessed)}</span>
            </li>
          ))}
        </ul>
      </PageSection>
    </main>
  );
}
