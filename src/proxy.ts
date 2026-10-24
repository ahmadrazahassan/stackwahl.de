import { NextResponse, type NextRequest } from "next/server";
import { isUnknownContentPath } from "@/lib/content/known-paths";

// With Cache Components, a dynamic page that calls notFound() after streaming has begun keeps
// status 200 (Next.js docs: loading, "Status codes"). Unknown slugs are therefore answered here,
// before rendering, with a rewrite to a static not-found route that returns a real 404.
export function proxy(request: NextRequest) {
  if (isUnknownContentPath(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL("/nicht-gefunden", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/software/:path*", "/kategorien/:slug/:rest*", "/glossar/:slug/:rest*"],
};
