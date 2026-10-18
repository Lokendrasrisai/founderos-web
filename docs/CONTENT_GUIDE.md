# Content Guide

Everything public is edited in `src/config/site.ts` and `src/content/**`. You never need to touch components.

## The rule that governs everything
Each claim is a record with a `governance` block:

```ts
governance: {
  owner: "jane-doe",            // who is accountable for this record
  verification: "verified",     // "verified" | "unverified" | "placeholder"
  approval: "approved",         // "approved" | "draft" | "demo"
  lastReviewed: "2026-11-02",   // YYYY-MM-DD
  notes: "Checked against repo history", // optional, never rendered
}
```

**A record appears on the public site only when it is `approved` AND `verified`.** Anything else is invisible
in production. If a whole collection is empty, its nav link, homepage section, and sitemap entry disappear
and the page shows a short, truthful explanation.

### Previewing drafts
```bash
npm run dev:preview        # FOUNDEROS_DEMO_CONTENT=true next dev
```
Preview shows drafts and DEMO_ONLY fixtures with yellow badges and a banner, and is never indexed.
A production deployment refuses to build with this flag.

### Before you approve something, check:
- Is every fact true today, and could you show evidence if asked?
- Does it describe what *we* did (not an employer or a collaborator) — or do we have written permission?
- Does it avoid words that imply a company, customers, revenue, or investors that don't exist?
- Do all links work and point to public pages?

---

## Change the brand name, tagline, or description
`src/config/site.ts` → `name`, `shortName`, `monogram`, `tagline`, `description`. Set
`nameIsWorkingTitle: false` once the name is final. Metadata, footer, share image, and privacy notice follow
automatically. Update `src/app/icon.svg` by hand if the mark changes.

## Update legal entity status
Only after incorporation: in `site.ts` set
`entity: { status: "formed", legalName: "Example Labs, Inc.", jurisdiction: "Delaware" }`.
The footer and privacy notice then name the entity. Until then they say the team is not yet a legal entity.

## Update contact information
- **Public email:** `site.contact.email = "hello@yourdomain.com"` (a real, monitored inbox). The contact page
  then shows a `mailto:` card.
- **Contact form:** set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in the hosting environment
  (see DEPLOYMENT.md). The form replaces the mailto card. The privacy notice updates itself.
- **Socials:** `site.social = [{ label: "GitHub", href: "https://github.com/your-org" }]`.
- Redeploy after any change (pages are static).

## Add a founder
Edit `src/content/founders/index.ts`:

```ts
export const founders: Founder[] = [
  {
    slug: "jane-doe",                       // lowercase, hyphens
    name: "Jane Doe",
    role: "Engineering & infrastructure",   // public role — not a legal title like "CEO" unless true
    summary: "One sentence, written by Jane.",
    bio: ["Paragraph one.", "Paragraph two."],
    expertise: ["Distributed systems", "Developer tooling"],
    education: ["BSc Computer Science, Example University"], // only if Jane approves
    photo: { src: "/images/founders/jane-doe.jpg", alt: "Jane Doe, smiling, outdoors", width: 960, height: 1200 },
    links: { linkedin: "https://www.linkedin.com/in/…", github: "https://github.com/…", website: "https://…" },
    order: 1,
    governance: { owner: "jane-doe", verification: "verified", approval: "approved", lastReviewed: "2026-11-02" },
  },
];
```
Profiles render on `/about#team` (full bio) and the homepage (summary), for any number of founders.
The founder whose profile it is should write and approve it.

## Add images
- Put files in `public/images/…` (create the folder). Prefer JPEG/WebP, at least 1600px on the long edge for
  covers, 960×1200 (4:5) for portraits.
- Always give `alt` text that describes the image's content, and the intrinsic `width`/`height`.
- Images are served through `next/image` (responsive sizes, modern formats).

## Add a project
Edit `src/content/projects/index.ts`. Template:

```ts
{
  slug: "field-sync",
  title: "Offline-first field data sync",
  category: "Data systems",
  disciplines: ["software-engineering", "data-systems"], // expertise slugs
  type: "prototype",              // product | research | open-source | prototype | infrastructure
  year: 2026,
  summary: "One or two sentences.",
  role: "Jane designed the sync protocol; Sam built the mobile client.",
  technologies: ["TypeScript", "SQLite"],
  outcome: "Synced 12k records across 40 devices with zero conflicts lost (field trial, May 2026).", // omit if unmeasured
  cover: { kind: "generated", variant: "lattice", seed: 17, alt: "…" },   // or { kind: "image", src, alt, width, height }
  evidence: [{ src: "/images/projects/field-sync-arch.png", alt: "Architecture diagram…", width: 1600, height: 900 }],
  links: { source: "https://github.com/…", demo: "https://…" },
  contributors: ["jane-doe"],
  permission: "own-work",         // or "permission-granted" (written permission on file) / "permission-pending" (hidden)
  featured: true,                 // featured projects lead the homepage
  caseStudy: { context: [], problem: [], approach: [], architecture: [], implementation: [], verification: [], outcomes: [], lessons: [] },
  governance: { … },
}
```
Empty case-study sections are skipped. Work done for an employer or client requires written permission.

## Publish a research article
1. Create `src/content/research/<slug>.mdx` with the body (start at `##` headings — the page renders the title).
   Code blocks get syntax highlighting; GitHub-style tables are made responsive; external links open safely.
2. Register it in `articles` in `src/content/research/index.ts` with `title`, `topic`, `authors` (founder slugs),
   `publishedAt`, `excerpt`, and `references`.
3. **References must be real sources you have read.** Never add a citation you haven't checked.
4. Have another founder review it, then set governance to `approved` + `verified`.

A table of contents appears automatically when the article has three or more `##`/`###` headings.
Reading time is calculated from the text.

## Confirm an area of expertise
`src/content/expertise/index.ts` holds six suggested areas as **unverified drafts** (hidden publicly).
For each one the team can genuinely support: add concrete `relevantExperience`, trim `technologies` to what
you've used in depth, then set `approved` + `verified`. Delete areas you can't support.

## Edit page copy
Hero, philosophy, principles, process stages, About narrative, Join page, and closing CTA live in
`src/content/copy.ts`. They describe intent and method, not achievements — keep factual claims in governed
records.

## Update metadata
- Site-wide: `site.name`, `site.tagline`, `site.description` in `site.ts`; set `NEXT_PUBLIC_SITE_URL` once a
  domain exists (enables canonical URLs and the sitemap).
- Per page: the `pageMetadata({...})` call at the top of each `src/app/**/page.tsx`.
- Projects and articles derive title/description from their records.
- If you change data practices (analytics, embeds, new forms), update `src/app/privacy/page.tsx` and
  `site.privacyLastUpdated`.

## Remove the demo fixtures (optional)
They never ship to production, but once real content exists you can delete `src/content/founders/demo.ts`,
`src/content/projects/demo.ts`, `demoArticles` and `demo-governed-content.mdx`, and their imports in
`src/lib/content.ts`. Update the preview-mode tests accordingly.
