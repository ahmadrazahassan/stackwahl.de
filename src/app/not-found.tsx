import type { Metadata } from "next";
import { NotFoundContent } from "@/components/page/not-found-content";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: false },
};

// Unmatched URLs outside the public route group land here (no site shell available).
export default function NotFound() {
  return <NotFoundContent />;
}
