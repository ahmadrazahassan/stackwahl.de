# Decisions

Format: date, decision, reason, alternatives, when to revisit.

## 24.10.2026: Stack versions (verified live with `npm view` that day)

| Package                             | Version                             | Note                                   |
| ----------------------------------- | ----------------------------------- | -------------------------------------- |
| Node.js                             | 24.x (Active LTS 24.22.1 "Krypton") | `.nvmrc` 24.22.1, `engines` 24.x       |
| pnpm                                | 12.15.0                             | `packageManager`                       |
| next                                | 16.4.2                              | see exception below                    |
| react, react-dom                    | 19.3.1                              |                                        |
| typescript                          | 6.0.3                               | see exception below                    |
| tailwindcss, @tailwindcss/turbopack | 4.3.3                               |                                        |
| eslint                              | 9.39.5                              | see exception below                    |
| eslint-config-next                  | 16.4.2                              | matches next                           |
| zod                                 | 4.6.7                               |                                        |
| vitest / vite                       | 5.0.5 / 8.3.5                       |                                        |
| @playwright/test                    | 1.64.1                              |                                        |
| @axe-core/playwright                | 4.14.0                              |                                        |
| prettier                            | 3.9.10                              | with prettier-plugin-tailwindcss 0.8.1 |
| clsx / tailwind-merge               | 2.1.1 / 3.7.0                       |                                        |

### Exception: next 16.4.2 instead of 16.4.3

- **Reason:** 16.4.3 was published on 23.10.2026 at 13:40 UTC, inside pnpm's minimum release age window. pnpm tried to add `minimumReleaseAgeExclude` entries, and I removed them, because the build prompt (Section 4.8) forbids weakening the policy.
- **Alternatives:** exclude the package from the policy (rejected).
- **Revisit:** at the end of Phase 1, when 16.4.3 is outside the window.

### Exception: TypeScript 6.0.3 instead of 7.0.2

- **Reason:** typescript-eslint 8.72.0 (used by eslint-config-next) supports `typescript >=4.8.4 <6.1.0`. 6.0.3 is the newest version the lint stack supports, as Section 4.1 requires.
- **Revisit:** when typescript-eslint supports TypeScript 7.

### Exception: ESLint 9.39.5 instead of 10.13.0

- **Reason:** eslint-config-next 16.4.2 pulls in eslint-plugin-react 7.37.5, eslint-plugin-jsx-a11y 6.10.2 and eslint-plugin-import 2.32.0, which all declare peers up to ESLint 9. `pnpm peers check` is clean with 9.39.5.
- **Revisit:** when those plugins support ESLint 10.

### Kept defaults from create-next-app 16.4

Cache Components, Partial Prefetching, React Compiler, Turbopack with the `@tailwindcss/turbopack` loader (instead of PostCSS), `src/` directory, `@/*` alias, AGENTS.md.

## 24.10.2026: Fonts self hosted from Fontsource WOFF2 files

- **Decision:** use the Latin `wght` variable subsets from `@fontsource-variable/google-sans-flex` 5.3.2 and `@fontsource-variable/inter` 5.3.0, copied to `src/fonts/` and loaded with `next/font/local`. The OFL license texts come from the google/fonts repository.
- **Reason:** there was no Python or fonttools on this machine to subset the original TTFs. The Fontsource files are the same OFL fonts, already subset.
- **Coverage:** the Latin range includes ä ö ü ß, €, „ " and – (U+0000-00FF, U+2000-206F, U+20AC). It does **not** include the arrow → (U+2192). UI arrows are icons, never text characters.
- **Alternatives:** next/font/google (rejected, pitfall 4.2 and privacy); subsetting the TTF ourselves (possible later with fonttools for the opsz axis).
- **Revisit:** if we need the `opsz` or `ROND` axes of Google Sans Flex for display sizes.

## 24.10.2026: Fallback faces in compiled CSS

- **Decision:** keep next/font's automatic metric-adjusted fallback faces (`googleSansFlex Fallback`, `inter Fallback`, `src: local(Arial)` with size adjust). `check:css` allows exactly these and nothing else.
- **Reason:** without them the text shifts when the fonts swap in, which breaks the CLS budget of 0.05. They are invisible once the WOFF2 files load.
- **Alternative:** `adjustFontFallback: false` (rejected: worse CLS, and browser default fonts would show during loading).

## 24.10.2026: Preflight copied, no monospace font

- **Decision:** `src/styles/preflight.css` is a copy of the Tailwind 4.3.3 preflight with the system font stacks replaced: the body uses `var(--font-body)` and `code`/`pre` use `inherit`.
- **Reason:** the design brief allows only two fonts, and the reference images' mono labels are replaced by Inter uppercase labels (13.4).
- **Revisit:** re-copy on every Tailwind upgrade.

## 24.10.2026: Tailwind theme reset

- **Decision:** `--color-*`, `--font-*`, `--text-*`, `--shadow-*` and `--radius-*` are reset to `initial`. Only the brief's tokens exist, so `bg-red-500`, `shadow-lg` and similar classes don't compile.
- **Revisit:** never without a design brief change.

## 24.10.2026: Color tokens and contrast

These values are checked by `src/lib/contrast.test.ts` (WCAG 2.2 AA, 4.5:1 for text).

| Token         | Value     | Use                                                                                 |
| ------------- | --------- | ----------------------------------------------------------------------------------- |
| primary       | `#2F2FC1` | given by owner                                                                      |
| primary-hover | `#2424A0` | derived, darker                                                                     |
| primary-tint  | `#E6E6F8` | derived, light                                                                      |
| ink           | `#191919` | given by owner                                                                      |
| bg            | `#F1F1F1` | given by owner                                                                      |
| surface       | `#FFFFFF` |                                                                                     |
| muted         | `#5F5F5F` | chosen darker than the brief's example `#6B6B6B` to keep a safe margin on `#F1F1F1` |
| line          | `#DCDCDC` | decorative hairlines only, never the only signal                                    |
| positive      | `#1D6F3A` | pros/cons marks and validation only                                                 |
| negative      | `#B3261E` | pros/cons marks and validation only                                                 |

## 24.10.2026: 21st.dev components

- **Decision:** the owner asked to use the 21st.dev skill for UI components. Components from the catalog are used only as a structural starting point in Phase 1, and are fully restyled to Section 13: no gradients, no glow, no icon containers, tokens only.
- **Status:** the 21st MCP server is not connected in this environment yet. It needs an API key (`API_KEY_21ST`, free at https://21st.dev/mcp) in the plugin configuration.

## 24.10.2026: @types/node 24 instead of 26

- **Decision:** `@types/node` stays on the 24.x line.
- **Reason:** the types must match the runtime, which is Node 24 Active LTS (locally and on Vercel). Node 26 is not LTS yet.
- **Revisit:** when Node 26 becomes Active LTS and the runtime moves.

## 24.10.2026: Phase 1 UI dependencies

| Package                  | Version | Reason                                                                           |
| ------------------------ | ------- | -------------------------------------------------------------------------------- |
| radix-ui                 | 1.8.1   | Accessible primitives (Dialog, NavigationMenu, Tabs, Checkbox, Switch), unstyled |
| cmdk                     | 1.1.1   | Command palette with keyboard navigation (Section 8, search)                     |
| lucide-react             | 1.61.0  | The only icon set allowed by the brief (13.9)                                    |
| class-variance-authority | 0.7.1   | Button variants                                                                  |

`motion` is not installed. The only animations so far (arrow nudge, tab underline, switch, marquee) are plain CSS, so the library isn't needed yet.

## 24.10.2026: Components built without 21st.dev

- **Decision:** the 21st.dev MCP server still isn't connected (no `API_KEY_21ST`), so every component is written in-house on Radix primitives and styled to Section 13.
- **Revisit:** once the key is set. Catalog components may then serve as structural starting points, restyled to the tokens.

## 24.10.2026: Arrow segment and icon containers

- **Decision:** the split button keeps the arrow in a second segment of the button itself (reference 1). Everywhere else, icons have no background: the "Weiterlesen" arrows on the guide cards are plain icons, not squares.
- **Reason:** the owner banned backgrounds behind icons. The button segment is part of the button shape and reads as one control.
- **Revisit:** if the owner prefers plain buttons. That would be a one-line change in `src/components/ui/button.tsx`.

## 24.10.2026: Scroll containers are positioned

- **Decision:** every `overflow-x-auto` container also gets `position: relative`, and scrollable regions without their own focusable content get `role="region"`, an `aria-label` and `tabIndex={0}`.
- **Reason:** visually hidden text (`sr-only`) inside horizontally scrolling tables escaped the scroll container and widened the page on phones (531 px on a 390 px screen). axe also requires scrollable regions to be reachable with the keyboard.

## 24.10.2026: ESLint 9 deprecation notice

pnpm now marks eslint 9.39.5 as deprecated in favor of 10.x. We stay on 9 for the same peer reason as above (eslint-plugin-react, jsx-a11y and import support only up to 9). Revisit at the end of Phase 2.
