# Architecture

## Stack (verified 2026-10-18)
| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router (Turbopack build) | 16.4.2 |
| UI | React | 19.3.0 |
| Language | TypeScript, `strict: true` | 5.9.3 |
| Styling | Tailwind CSS v4 + CSS custom-property tokens | 4.3.3 |
| Content | Typed TS modules + MDX (`@next/mdx`, remark-gfm, rehype-slug, rehype-pretty-code/Shiki) | 16.4.2 / 3.x |
| Validation | Zod | 4.6.7 |
| Icons | lucide-react | 1.59.0 |
| Fonts | Geist Sans / Geist Mono, self-hosted from the `geist` package | 1.8.1 |
| Unit tests | Vitest | 5.0.5 |
| E2E / a11y | Playwright + @axe-core/playwright | 1.64.1 / 4.14.0 |
| Lint | ESLint 9 + eslint-config-next (core-web-vitals, typescript) | 16.4.2 |

No database, auth, CMS, analytics, motion library, or component library. Client JavaScript is limited to
the navigation (active route, mobile dialog), theme toggle, process explorer, work filter, and contact form.

## Rendering model
Every route is **statically prerendered at build time** (`○`/`●` in the build output). Dynamic segments use
`generateStaticParams` + `dynamicParams = false`, so unknown slugs return 404. The only server code that
runs per request is the contact form's Server Action. Cache Components is intentionally off (DECISIONS D2).

Consequence: content and environment changes take effect on the next build/deploy.

## Directory map
```
src/
  app/                    Routes (App Router). Each page composes sections; no data logic in JSX.
    contact/actions.ts    Server Action: validation, bot checks, rate limit, delivery
    sitemap.ts robots.ts  Generated from publishable content only
    opengraph-image.tsx   Build-time share image from site config
    icon.svg              Favicon
  components/
    layout/               Navigation, NavLinks, MobileNavigation, ThemeToggle, Footer, PreviewBanner
    sections/             Hero, Philosophy, ExpertiseIndex, SelectedWork, Team, Approach, ProcessExplorer,
                          ResearchSection, ClosingCta, PageIntro, WorkGallery
    cards/                ProjectCard, FounderCard, ExpertiseCard, ArticleCard
    ui/                   Button/ButtonLink, Badge/PreviewBadge, SectionContainer/SectionHeading, Timeline,
                          Callout/EmptyState/LoadingState/ErrorState, Breadcrumbs, Monogram
    visuals/              HeroGraphic, CoverArt (generated project artwork), Portrait
    forms/                ContactForm
  config/                 site.ts (brand, entity, contact), navigation.ts
  content/                copy.ts, founders/, projects/, expertise/, research/ (records + MDX)
  lib/                    content.ts (publication gate), validation.ts, rate-limit.ts, contact-config.ts,
                          metadata.ts, article-source.ts, fonts.ts, utilities.ts
  styles/globals.css      Tokens, base, layout primitives, prose, motion
  types/content.ts        Content model
  tests/unit/             Vitest
  mdx-components.tsx      MDX element mapping (responsive tables, safe external links)
tests/e2e/                Playwright specs (mode-aware)
scripts/e2e.sh            Builds and tests production, preview, and form modes
docs/                     This documentation + evidence/
```

## The publication gate
`src/lib/content.ts` is the only module that reads `src/content/**`. Components call `getProjects()`,
`getFounders()`, etc. A record is returned only if:

- `governance.approval === "approved"` **and** `governance.verification === "verified"`, and
- for projects, `permission !== "permission-pending"`,

…or preview mode is on (`FOUNDEROS_DEMO_CONTENT=true` and `VERCEL_ENV !== "production"`), in which case drafts
and DEMO_ONLY fixtures are included and every one is badged. `next.config.ts` throws if the preview flag is
set on a production deployment, and adds `X-Robots-Tag: noindex` to preview builds.

`getSectionAvailability()` drives the navigation, homepage sections, hero CTAs, and sitemap, so an empty
collection disappears everywhere at once.

## Contact flow
```
ContactForm (client)
  ├─ client validation (same Zod schema) → inline errors, focus first invalid field
  └─ Server Action submitContact
       ├─ delivery configured?            no → error (form is never rendered in that case anyway)
       ├─ honeypot / time-to-submit check  fail → generic failure
       ├─ per-IP rate limit (5 / 10 min)   fail → "try again in N minutes"
       ├─ Zod validation                   fail → field errors
       └─ POST Resend /emails (10 s timeout)
             2xx → "Message sent."   otherwise → generic failure; values preserved
```
The contact page renders exactly one of: form (delivery env set), `mailto:` card (`site.contact.email` set),
or an explicit not-configured state. Nothing is stored; logs contain status codes only.

## Security
- Strict CSP (`default-src 'self'`, no third-party origins, `frame-ancestors 'none'`, `form-action 'self'`,
  `object-src 'none'`). `script-src` allows `'unsafe-inline'` because static pages can't carry per-request
  nonces; there are no third-party scripts to exploit it with. Documented trade-off.
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, COOP; `X-Powered-By` off.
- Secrets only in server env; nothing is exposed via `NEXT_PUBLIC_*` except the site URL.
- Email header injection prevented (`sanitizeHeaderValue`); article slugs validated before file reads.
- All external links: `target="_blank" rel="noopener noreferrer"` + screen-reader hint.

## Accessibility architecture
Semantic landmarks, one `h1` per page, skip link, visible `:focus-visible` ring, native `<dialog>` for the
mobile menu, WAI-ARIA tabs only for the process explorer (where a native equivalent doesn't exist),
`aria-pressed` toggle buttons for filters, `aria-live` result count, `aria-invalid` + `aria-describedby`
form errors, focus moved to form outcomes, `prefers-reduced-motion` honoured globally.
