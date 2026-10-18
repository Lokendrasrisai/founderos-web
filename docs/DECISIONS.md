# Decision Log

Each entry: context → decision → consequence.

### D1 — Next.js 16.4.2, React 19.3, Tailwind 4.3, TypeScript 5.9 (strict)
Verified on 2026-10-18 against the npm registry and the official `create-next-app@16.4.2` generator.
TypeScript 7.0 is the registry's `latest`, but the official generator and `typescript-eslint` still target
TypeScript 5.x, so we follow the generator rather than mixing an unsupported compiler into the toolchain.
ESLint 9 is what `eslint-config-next@16.4.2` is built for. The bundled Next.js docs
(`node_modules/next/dist/docs`) were read for Cache Components, MDX, forms, and static params.

### D2 — Cache Components turned OFF
The generator enables `cacheComponents` + `partialPrefetching`. With Cache Components on,
`generateStaticParams` must return at least one param or the build fails. Our production collections are
legitimately empty until founders approve content, so that rule would force a fake record. The site is fully
static marketing content and gains nothing from Cache Components. Every page is prerendered at build time;
`dynamicParams = false` makes unknown slugs 404.

### D3 — Self-hosted fonts
Geist Sans (variable, preloaded) and Geist Mono (regular weight, not preloaded) are loaded with
`next/font/local` from the official `geist` package. No build-time or runtime requests to a font CDN.
A serif display face was trialled and dropped: one family with a strong type scale fits the Swiss brief
better, and it saves a font download. Mono not preloaded: it's only used for small metadata, and keeping it
off the critical path improved mobile LCP.

### D4 — Content as typed TypeScript modules + MDX bodies
No CMS in V1. Records live in `src/content/**` with a `governance` block. `src/lib/content.ts` is the only
reader. Article bodies are MDX compiled by `@next/mdx` with Turbopack-compatible string plugin config.
TOC and reading time are derived from the MDX source at build time using the same slugger as `rehype-slug`.

### D5 — Publication gate and preview mode
Public iff `approval === "approved"` and `verification === "verified"` (projects also need
`permission !== "permission-pending"`). Preview mode (`FOUNDEROS_DEMO_CONTENT=true`, not on
`VERCEL_ENV=production`) additionally shows drafts and DEMO_ONLY fixtures, each badged, with a site-wide
banner, `noindex` meta, `X-Robots-Tag: noindex`, and a disallow-all robots.txt. `next.config.ts` throws if the
flag is set on a production deployment.

### D6 — Empty sections are hidden from navigation, not faked
No publishable records → nav link removed, homepage section removed, sitemap entry removed, page shows a
short truthful explanation (never "Coming soon"). Hero CTAs switch to targets that exist.

### D7 — Contact delivery: Resend REST API, opt-in by env vars
No SDK, free tier, works on serverless. Enabled only when all three env vars exist. Otherwise a configured
`mailto:` link, else an explicit not-configured state. Success is shown only on a 2xx from the provider.

### D8 — Abuse protection without third-party scripts
Honeypot, minimum time-to-submit, server-side Zod validation, length limits, in-memory per-IP rate limit.
Limitation: per-instance on serverless. Upgrade path in DEPLOYMENT.md.

### D9 — Motion is CSS-only
One orchestrated moment: the hero graphic draws in once; the headline settles with transform only (so the
LCP text is visible from first paint). No motion library, nothing loops, reduced motion respected globally.
Scroll-triggered reveals were considered and left out — they add risk (hidden content in screenshots,
contrast checks, slower perceived load) for little benefit.

### D10 — Mobile navigation uses native `<dialog>`
`showModal()` provides focus containment, Escape-to-close, inert background; focus returns to the trigger.

### D11 — Theme
Dark default; follows the OS when no choice is stored; explicit choice stored in `localStorage` (not a
cookie) and applied by an inline head script before first paint.

### D12 — CSP with `'unsafe-inline'` scripts
Static pages can't carry per-request nonces without becoming dynamic. With no third-party script origins
allowed, the residual risk is low; everything else in the CSP is strict. Revisit if user-generated content
is ever rendered.

### D13 — Shiki themes
`github-dark-dimmed` / `github-light-high-contrast`. The regular GitHub light theme failed axe colour-contrast
for some tokens on the light surface.

### D14 — Browser tests in this build sandbox
The Playwright browser CDN was blocked by the sandbox network policy. Tests ran against Chromium 153
from the npm registry (`@sparticuz/chromium`) via `PLAYWRIGHT_CHROMIUM_PATH`. On a normal machine run
`npx playwright install chromium` and leave the variable unset.
