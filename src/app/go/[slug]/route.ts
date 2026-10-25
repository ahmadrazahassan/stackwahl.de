import { allAffiliateLinks } from "content-collections";
import { NextResponse, type NextRequest } from "next/server";
import { REDIRECT_HEADERS, resolveRedirect } from "@/lib/affiliate";
import { getAllSoftware } from "@/lib/content";
import { siteConfig } from "@/site.config";

// /go/[slug]?from=<placement>&pos=<n>: the only way commercial links leave the site (Section 8).
// Outside the public route group, disallowed in robots.txt, never indexed or cached.
export async function GET(request: NextRequest, { params }: RouteContext<"/go/[slug]">) {
  const { slug } = await params;
  const result = resolveRedirect({
    slug,
    from: request.nextUrl.searchParams.get("from"),
    pos: request.nextUrl.searchParams.get("pos"),
    enabled: siteConfig.features.affiliateLinks,
    links: allAffiliateLinks,
    knownSoftware: new Set(getAllSoftware().map((s) => s.slug)),
  });

  if (result.kind === "partner") {
    // Anonymous click count: software, placement and position only. No IP, no cookie, no id.
    console.info(JSON.stringify({ event: "affiliate_click", ...result.click }));
  }

  const location =
    result.kind === "partner" ? result.location : new URL(result.location, request.url);
  return NextResponse.redirect(location, { status: 307, headers: REDIRECT_HEADERS });
}
