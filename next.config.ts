import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  // Inlined at build time: "1" only in preview builds (scripts/build-preview.ts).
  env: { STACKWAHL_SHOW_DRAFTS: process.env.STACKWAHL_SHOW_DRAFTS === "1" ? "1" : "0" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// withContentCollections builds /content into .content-collections/generated before Next runs.
export default withContentCollections(nextConfig);
