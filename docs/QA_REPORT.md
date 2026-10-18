# QA Report — 2026-10-18

Environment: Linux sandbox, Node 22.22.0, npm 10.9.4. Browser tests used Chromium 153 (headless) supplied
via `PLAYWRIGHT_CHROMIUM_PATH` because the Playwright browser CDN was blocked by the sandbox network
(see DECISIONS D14). Raw logs are in `docs/evidence/`.

Status key: **PASS** executed and passed · **FAIL** executed and failed · **NOT TESTED** not executed ·
**BLOCKED** could not be executed in this environment.

## Summary of required checks

| # | Check | Status | Evidence / notes |
| --- | --- | --- | --- |
| 1 | Install dependencies | PASS | `npm install` from a clean directory; 0 vulnerabilities in production dependencies. 5 "high" advisories are in dev-only ESLint tooling (`braces` via `eslint-config-next` → `fast-glob`); the only "fix" downgrades `eslint-config-next` to v14, so it was not applied. |
| 2 | Linting (ESLint 9, next core-web-vitals + typescript) | PASS | `docs/evidence/check.log` — 0 errors, 0 warnings |
| 3 | TypeScript (`strict`) | PASS | `next typegen && tsc --noEmit` — 0 errors |
| 4 | Unit tests (Vitest) | PASS | 36 / 36 — publication gate, preview guard, content integrity, validation, bot heuristics, rate limiter, contact mode, entity claims, TOC/reading time, config security headers |
| 5 | Production build | PASS | All 14 routes prerendered static (`○`/`●`); preview build 18 routes |
| 6 | Playwright E2E | PASS | production 58 passed · preview 59 passed · form 62 passed · 0 failed (179 executed; skips are tests scoped to another mode) — `docs/evidence/e2e-*.log` |
| 7 | Automated accessibility (axe-core, WCAG 2.0/2.1/2.2 A+AA tags) | PASS | 0 violations on every page, dark and light themes, all three modes, plus the open mobile menu. Lighthouse accessibility 100 on measured pages. |
| 8 | Viewport inspection | PASS | Automated: no horizontal overflow on every page at 320/375/430/768/1024/1440/1920. Manual: screenshots reviewed at 390, 768, 1024, 1440 (dark) and 1440 (light). See "Design QA". |
| 9 | Internal navigation | PASS | E2E crawls every internal link on every page (incl. `#` anchors) — all 200 / present |
| 10 | Configured external links | BLOCKED | Production content contains no external links (no socials, no project/founder links yet). The demo article's 3 references (W3C WCAG 2.2, web.dev Web Vitals, Next.js docs) could not be fetched from the sandbox. Static check PASS: all external links use `https`, `target="_blank"`, `rel="noopener noreferrer"`. |
| 11 | Placeholders / missing claims | PASS | E2E asserts the production build contains no fixture names, "Placeholder", "Demo content", "Preview build", "Inc.", "LLC", or "coming soon"; unit tests assert production content files contain no demo records and site config has no invented email or entity. |
| 12 | Console errors | PASS | E2E asserts zero console errors / page errors on every page in every mode (expected 404 resource error only on the 404 test) |
| 13 | Empty and error states | PASS | Production build E2E verifies empty states on /work, /research, /expertise, /about team; contact not-configured state; 404 page and 404 status for unknown slugs. `ErrorState` (app/error.tsx) is NOT TESTED by an induced runtime error. |
| 14 | Deployment configuration | PASS (static) / NOT TESTED (live) | Build guard (demo flag + `VERCEL_ENV=production` → build fails) unit-tested; security headers and noindex rules E2E-tested on `next start`. No real deployment was made. |

## Lighthouse (lab, local production build — not field data)
From `docs/evidence/lighthouse.txt`:

| Page | Form factor | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | mobile | 98 | 100 | 100 | 100 | 2.3 s | 0 | 90 ms |
| / | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| /about | mobile | 99 | 100 | 100 | 100 | 2.1 s | 0 | 50 ms |
| /about | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |
| /contact | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 | 40 ms |
| /contact | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |
| /privacy | mobile | 98 | 100 | 100 | 100 | 2.4 s | 0 | 50 ms |
| /privacy | desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms |

Mobile LCP varied between 2.3 s and 2.9 s across runs before two fixes (headline animates transform only;
Geist Mono no longer preloaded). Simulated mobile LCP sits close to the 2.5 s threshold; real field values
(p75 LCP/INP/CLS) can only be measured after deployment. INP: NOT TESTED (needs real interactions).

## E2E coverage (what the 179 executed tests check)
- Every page: 200, exactly one `h1`, title, banner/main/contentinfo landmarks, no console errors
- 404 page (status, copy, `noindex`); unknown project/article slugs 404
- No horizontal overflow at 7 widths; mobile menu trigger ≥ 40×40px
- Internal link crawl; safe external links
- axe: all pages × dark/light; open mobile dialog
- Keyboard: skip link first tab stop → focuses `main`; visible 2px focus ring; 200% text zoom reflow at 640px
- Navigation: `aria-current` on active route; primary action; theme toggle switches, persists across reloads
- Mobile dialog: opens modal, focus on close button, Escape closes, focus returns to trigger, focus stays
  inside while open, navigating closes it
- Process explorer: tabs pattern (arrows, End, wrap, click); mobile shows the full sequence without JS interaction
- Work filters (preview): discipline/type filtering, `aria-pressed`, live count, empty result + clear
- Article (preview): TOC targets exist, syntax highlighting present, table in scrollable region, references
- Truthfulness (production): no fixture text, nav shows only About/Contact, empty homepage sections omitted,
  empty-state copy present, entity statement, indexable, no invented canonical, empty sitemap, security headers
- Preview: banner + `noindex` meta on every page, `X-Robots-Tag`, disallow-all robots, every fixture badged
- Contact (form mode, mock provider): client errors linked via `aria-describedby` + `aria-invalid` and focus;
  success shown only after provider 2xx and payload has `reply_to`; provider 500 → error, values kept, no
  success text; too-fast submission rejected without calling the provider; privacy notice reflects the form

## Design QA (manual, from rendered screenshots)
Reviewed: full homepage (production and preview), every page at 1440, key pages at 390, homepage at 768 and
1024, light theme, mobile menu open, contact validation state, 404 on mobile.

Issues found and fixed during review:
1. Hero headline wrapped to three lines ("Driven to / create.") — indent removed, display scale and column split rebalanced.
2. Hero accent path didn't render (sparse first columns) — graph now guarantees a node per column on the path.
3. Section top rules extended into the page gutters — moved the rule inside the container.
4. Two-column rows (principles, expertise index, join) used different column splits — unified.
5. Article list and article body dividers misaligned with the editorial grid / bled into gutters — fixed.
6. Excessive vertical whitespace between sections — section rhythm token reduced.
7. Process explorer "loop" rail extended past the tab list and into the gutter — contained.
8. Lattice cover artwork clipped on the right edge — grid now centred within the frame.
9. Feature project card had a large empty gap — spacing tightened.
10. Team intro said "profiles appear once approved" even when profiles were shown — now conditional.
11. Light-theme code highlighting failed contrast — switched to a high-contrast light theme.
12. Brand link accessible name mismatched its visible text — fixed.
13. Contact empty state exposed internal "site owners" instructions to visitors — removed (moved to docs).

Known visual notes (not defects): the hero graphic's loose-side curves are intentionally irregular; on
tablets the graphic sits below the hero text at up to 480px wide.

## Not tested
- Screen readers (VoiceOver, NVDA, TalkBack) — NOT TESTED. Automated checks cover only part of WCAG 2.2 AA;
  a manual screen-reader pass is recommended before launch.
- Safari, Firefox, and real mobile devices — NOT TESTED (Chromium only).
- Windows High Contrast / forced-colors mode — NOT TESTED.
- Real email delivery through Resend — NOT TESTED (no account or keys; tested against a local mock).
- Live deployment, HTTPS headers on the real host, field Core Web Vitals — NOT TESTED (not deployed).
- Induced runtime error rendering `app/error.tsx` — NOT TESTED.
