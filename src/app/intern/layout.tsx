import type { Metadata } from "next";

// Internal pages: never indexed, disallowed in robots, outside the public shell (Section 5.6).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InternalLayout({ children }: LayoutProps<"/intern">) {
  return children;
}
