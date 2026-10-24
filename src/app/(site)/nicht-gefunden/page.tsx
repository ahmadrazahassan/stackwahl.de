import { notFound } from "next/navigation";

// Target of the Proxy rewrite for unknown slugs (src/proxy.ts). It calls notFound() during
// prerendering, so it stays static and answers with a real 404 status.
export default function NichtGefunden() {
  notFound();
}
