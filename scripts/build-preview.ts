// Preview build with drafts visible, for the E2E tests and internal review. Never deploy it:
// it shows unpublished, unverified content. Indexing stays off (site.config).
import { execSync } from "node:child_process";
import { TEST_MAIL_ENV } from "../e2e/test-env.ts";

// The forms render only when mail is configured, so the preview build sees the test outbox too.
const env = { ...process.env, ...TEST_MAIL_ENV, STACKWAHL_SHOW_DRAFTS: "1" };
for (const command of ["pnpm content:validate", "pnpm search:index", "pnpm exec next build"]) {
  execSync(command, { stdio: "inherit", env });
}
