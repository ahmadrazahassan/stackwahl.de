import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllSoftware,
  getAuthor,
  getAuthors,
  getGuides,
  PLACEHOLDER_SLUG,
  staticSlugs,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { absoluteUrl, breadcrumbLd, pageMetadata, personLd } from "@/lib/seo";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getAuthors().map((a) => a.slug));
}

function load(slug: string) {
  return slug === PLACEHOLDER_SLUG ? undefined : getAuthor(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/redaktion/[slug]">): Promise<Metadata> {
  const author = load((await params).slug);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name}, ${author.role}`,
    description: author.bio.slice(0, 155),
    path: routes.author(author.slug),
    type: "profile",
  });
}

export default async function AuthorPage({ params }: PageProps<"/redaktion/[slug]">) {
  const author = load((await params).slug);
  if (!author) notFound();
  const software = getAllSoftware()
    .filter((s) => s.author === author.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
  const guides = getGuides().filter((g) => g.author === author.slug);
  const crumbs = [
    { label: "Start", href: routes.home() },
    { label: "Redaktion", href: routes.editorial() },
    { label: author.name },
  ];

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd
        data={[
          breadcrumbLd(crumbs, routes.author(author.slug)),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: absoluteUrl(routes.author(author.slug)),
            mainEntity: {
              ...personLd(author),
              description: author.bio,
              knowsAbout: author.expertise,
            },
          },
        ]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Redaktion"
        title={author.name}
        tail={author.role}
        lead={author.bio}
      />
      <PageSection id="themen" label="Themen" title="Themen">
        <ul className="flex flex-wrap gap-2">
          {author.expertise.map((e) => (
            <li key={e} className="rounded-pill border border-line px-4 py-2 text-small">
              {e}
            </li>
          ))}
        </ul>
        {author.links.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-small">
            {author.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center font-medium underline underline-offset-4"
                >
                  {l.label}
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </PageSection>
      {software.length > 0 ? (
        <PageSection
          id="profile"
          label="Profile"
          title={`Verantwortet ${software.length} Softwareprofile`}
        >
          <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {software.map((s) => (
              <li
                key={s.slug}
                className="flex items-baseline justify-between gap-4 border-t border-line py-3 text-small"
              >
                <Link
                  href={routes.software(s.slug)}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {s.name}
                </Link>
                <span className="text-muted tabular">{formatDate(s.lastReviewed)}</span>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}
      {guides.length > 0 ? (
        <PageSection
          id="ratgeber"
          label="Ratgeber"
          title={`Verantwortet ${guides.length} Ratgeber`}
        >
          <ul className="flex flex-col">
            {guides.map((g) => (
              <li
                key={g.slug}
                className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-line py-3 text-small"
              >
                <Link
                  href={routes.guide(g.slug)}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {g.title}
                </Link>
                <span className="text-muted tabular">{formatDate(g.updated)}</span>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}
    </main>
  );
}
