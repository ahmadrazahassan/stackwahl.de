"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/** Paths whose query string can hold personal data: confirmation tokens and free-text search. */
const PRIVATE_QUERY_PATHS = ["/newsletter", "/suche"];

/** Drops the query string where it could carry a token or what someone typed. */
function redact(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  if (PRIVATE_QUERY_PATHS.some((path) => url.pathname.startsWith(path))) url.search = "";
  return { ...event, url: url.toString() };
}

/** Vercel Web Analytics: cookieless page views, described in the Datenschutzerklärung. */
export function SiteAnalytics() {
  return <Analytics beforeSend={redact} />;
}
