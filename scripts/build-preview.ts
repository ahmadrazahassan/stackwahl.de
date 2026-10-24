// Preview build with drafts visible, for the E2E tests and internal review. Never deploy it:
// it shows unpublished, unverified content. Indexing stays off (site.config).
import { execSync } from "node:child_process";

const env = { ...process.env, STACKWAHL_SHOW_DRAFTS: "1" };
for (const command of ["pnpm content:validate", "pnpm search:index", "pnpm exec next build"]) {
  execSync(command, { stdio: "inherit", env });
}
