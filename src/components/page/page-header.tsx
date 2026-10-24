import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/software/profile-header";
import { DemoNote } from "@/components/ui/labels";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";
import { SHOW_DRAFTS } from "@/content/visibility";

/** Standard page head: breadcrumbs, eyebrow, H1 with muted tail, lead and optional meta line. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  tail,
  lead,
  meta,
  draft = false,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  tail?: string;
  lead?: ReactNode;
  meta?: ReactNode;
  /** Shows the draft marker (dev only, drafts never reach production). */
  draft?: boolean;
  children?: ReactNode;
}) {
  return (
    <Panel as="header">
      <Container className="py-12 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Eyebrow className="text-muted">{eyebrow}</Eyebrow>
          {draft && SHOW_DRAFTS ? <DemoNote>Entwurf, nicht veröffentlicht</DemoNote> : null}
        </div>
        <Headline as="h1" size="h1" tail={tail} className="mt-6 max-w-[22ch]">
          {title}
        </Headline>
        {lead ? <Lead className="mt-6">{lead}</Lead> : null}
        {meta ? <p className="mt-6 text-small text-muted">{meta}</p> : null}
        {children}
      </Container>
    </Panel>
  );
}

/** A content section in its own panel with an asymmetric label column. */
export function PageSection({
  id,
  label,
  title,
  children,
  tone = "surface",
}: {
  id?: string;
  label: string;
  title: string;
  children: ReactNode;
  tone?: "surface" | "bg";
}) {
  return (
    <Panel
      as="section"
      tone={tone}
      aria-labelledby={id ? `${id}-titel` : undefined}
      id={id}
      className="scroll-mt-16"
    >
      <Container className="py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-3">
            <Eyebrow className="text-muted">{label}</Eyebrow>
          </div>
          <div className="min-w-0 lg:col-span-9">
            <h2 id={id ? `${id}-titel` : undefined} className="text-h2">
              {title}
            </h2>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Container>
    </Panel>
  );
}
