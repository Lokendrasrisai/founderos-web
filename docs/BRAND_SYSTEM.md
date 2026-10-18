# Brand & Design System

## Idea
**Precision meets ambition.** The visual language borrows from registration and measurement — corner ticks,
grids, routed lines — because the team's promise is disciplined execution of ambitious ideas. That idea is
spent in one place: the hero graphic, where loose points (questions) settle onto a grid and become a routed
system, with one cobalt path tracing a single idea end to end. Everything else stays quiet.

Things deliberately avoided: glowing gradients, particle fields, globes, floating code, identical card grids,
all-caps eyebrows on every section, arrows appended to every link.

## Logo / monogram
`components/ui/Monogram.tsx`: the configured letter (`site.monogram`) in a cobalt square inside four corner
registration ticks. Change the letter in `src/config/site.ts`. The favicon (`src/app/icon.svg`) uses the same
mark without the letter and must be edited by hand if the mark changes.

## Color tokens (`src/styles/globals.css`)
| Token | Dark (default) | Light | Use |
| --- | --- | --- | --- |
| `--color-bg` | `#090b10` | `#f5f6f8` | Page background |
| `--color-surface` | `#11151d` | `#ffffff` | Panels, code, inputs |
| `--color-elevated` | `#1a202a` | `#eaedf2` | Inline code, raised details |
| `--color-fg` | `#f5f7fa` | `#0c1018` | Primary text |
| `--color-muted` | `#a3acba` | `#4a5464` | Secondary text |
| `--color-subtle` | `#7d8796` | `#5f6a7a` | Metadata, captions |
| `--color-line` / `-strong` | white 9% / 18% | ink 10% / 20% | Rules, borders |
| `--color-accent` | `#7b93ff` | `#2c46d4` | Text links, active states (AA on bg) |
| `--color-accent-solid` | `#3d5afe` | `#2c46d4` | Primary button fill (white text) |
| `--color-steel` | `#8ea3c2` | `#4e6587` | Diagram strokes |
| `--color-cyan` | `#63c7dd` | `#1a7f96` | Secondary diagram accent (sparingly) |
| `--color-focus` | `#9db0ff` | `#2c46d4` | Focus ring |
| warn / danger / success | — | — | Preview badges, form errors, confirmation |

All text/background pairs used on the site pass WCAG 2.2 AA contrast in both themes (axe, 0 violations).
Tailwind utilities map to tokens: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `text-subtle`,
`border-line`, `text-accent`, `bg-accent-solid`, `text-steel`.

## Typography
- **Geist Sans** (variable, preloaded) for everything; display and headings at weight 500 with negative
  tracking. **Geist Mono** (regular, not preloaded) only for dates, years, technology tags, and stage numbers.
- Scale (fluid with `clamp()`):

| Role | Class | Size | Tracking / leading |
| --- | --- | --- | --- |
| Display | `.type-display` | 2.625 → 5rem | −0.04em / 0.98 |
| H1 | `.type-h1` | 2.5 → 4.75rem | −0.035em / 1.02 |
| H2 | `.type-h2` | 1.75 → 2.75rem | −0.025em / 1.08 |
| H3 | `.type-h3` | 1.25 → 1.5rem | −0.015em / 1.25 |
| Lead | `.type-lead` | 1.125 → 1.31rem | 1.5 |
| Body | — | 1rem (prose 1.0625rem) | 1.6 (prose 1.72) |
| Label | `.type-label` | 0.875rem | sentence case |
| Meta | `.type-meta` | 0.75rem mono | tabular numerals |

- Measure: `--measure: 66ch` for running text. Headings use `text-wrap: balance`.

## Spacing, radius, shadow, border
- 4px base via Tailwind; rhythm tokens: `--space-section` (4 → 6.5rem), `--space-block` (2.5 → 4rem),
  `--gutter` (1.25 → 3rem).
- Radius by object size: `--radius-xs` 3px (tags), `-sm` 6px (buttons, inputs), `-md` 10px (media, callouts),
  `-lg` 16px (panels).
- Shadows only on overlays (`--shadow-overlay`). Structure comes from 1px hairlines.

## Layout
- Container: `--container: 1280px` + gutters (`.container-site`); narrow 760px.
- **Editorial grid** (`.grid-editorial`): a 3/12 margin column that names the section, 9/12 for content. Used
  on every page so section names, headings, and rows align vertically down the whole site.
- Two-column rows (principles, expertise index, join) share the same split so their columns line up.
- Breakpoints: Tailwind defaults (sm 640, md 768, lg 1024, xl 1280) plus the editorial grid switch at 900px.

## Motion
| Token | Value | Use |
| --- | --- | --- |
| `--duration-fast` | 140ms | Hover/colour feedback |
| `--duration-base` | 240ms | Menu, indicator underline, tab marker |
| `--duration-slow` | 600ms | Hero text settle, panel fade |
| `--duration-draw` | 1800ms | Hero spine draw |
| `--ease-out` | cubic-bezier(.22,1,.36,1) | Default |
| `--ease-in-out` | cubic-bezier(.65,0,.35,1) | Path drawing |

One orchestrated moment on load (hero). Everything else is a response to the user. Nothing loops.
`prefers-reduced-motion: reduce` collapses all animation; the static end state is the design.

## Components
Navigation · MobileNavigation · ThemeToggle · Footer · PreviewBanner · Hero · PageIntro · SectionContainer ·
SectionHeading · Button / ButtonLink · Badge / PreviewBadge · ProjectCard · FounderCard · ExpertiseCard ·
ArticleCard · TechList · Timeline · Callout · EmptyState · LoadingState · ErrorState · Breadcrumbs ·
ProcessExplorer · WorkGallery · ContactForm · CoverArt · Portrait · HeroGraphic · Monogram.

Project covers are generated, original SVG artwork (four variants, deterministic per `seed`) unless a real
image is supplied. Founder portraits without an approved photo show initials on a quiet grid — never a
stock or generated face.
