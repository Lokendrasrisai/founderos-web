# FounderOS — founding-team website

A multi-page website for an emerging technology founding team. **"FounderOS" is a working name** — change it
in `src/config/site.ts`.

The site is built to be truthful by construction: every claim (people, projects, expertise, research) is a
governed record, and only records that are both **approved** and **verified** appear publicly. Today none
are, so the public build shows the team's principles, method, and honest empty states — no invented people,
projects, clients, or entity status.

## Quick start
```bash
npm install
npm run dev            # http://localhost:3000 — what the public site shows
npm run dev:preview    # also shows drafts + DEMO_ONLY fixtures, clearly badged
```

## Scripts
| Command | What it does |
| --- | --- |
| `npm run check` | Lint + typecheck + unit tests + production build |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Builds and runs Playwright in production, preview, and form modes (`npx playwright install chromium` first) |
| `npm run format` | Prettier |

## Stack
Next.js 16.4 (App Router, fully static) · React 19.3 · TypeScript 5.9 strict · Tailwind CSS 4.3 with CSS-variable
tokens · MDX for articles · Zod · lucide-react · self-hosted Geist · Vitest · Playwright + axe-core.

## Documentation
| Doc | Contents |
| --- | --- |
| [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) | Goals, constraints, recorded assumptions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Structure, rendering, publication gate, contact flow, security |
| [docs/BRAND_SYSTEM.md](docs/BRAND_SYSTEM.md) | Tokens, type scale, layout grid, motion, components |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | Add founders/projects/articles, change brand, contact, metadata |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel setup, environment variables, contact delivery, checklist |
| [docs/QA_REPORT.md](docs/QA_REPORT.md) | Every check run, with PASS / NOT TESTED / BLOCKED |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Why things are the way they are |
| `docs/evidence/` | Raw test logs, Lighthouse results, screenshots |

## Status
Not deployed. Contact delivery is not configured (the contact page says so). See the QA report's
"Not tested" list before launch.
