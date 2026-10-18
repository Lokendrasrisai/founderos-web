# Project Brief — FounderOS (working name)

## What this is
A multi-page website for a prospective founding team of four or more people. It presents the team's
principles, capabilities, selected verifiable work, and research, and offers a truthful way to get in touch.

"FounderOS" is a **temporary working name**. It is defined in one place (`src/config/site.ts`) and can be
replaced without touching components.

## Audience
Technical leaders, potential collaborators, investors, and future team members. They should leave with the
impression of a serious, capable team that values clarity, engineering quality, and long-term thinking.

## Hard constraints (from the brief)
- **Truthfulness first.** No invented clients, revenue, investors, awards, headcount, launches, biographies,
  case studies, or incorporation status.
- Every important public claim is a structured record with an owner, verification status, approval status,
  and last-reviewed date. Only `approved` + `verified` records render on the public site.
- Demo fixtures (`DEMO_ONLY`) exist for local design work and can never render in a production deployment.
- No contact form that pretends to deliver mail. No invented email addresses.
- No "Inc." / "LLC" unless configured as accurate.

## Facts we do NOT have yet (recorded assumptions)
| Item | Current handling |
| --- | --- |
| Company name | Working name "FounderOS" in `site.ts` |
| Legal entity | `entity.status = "not-formed"`; footer says so plainly |
| Domain | `site.url` reads `NEXT_PUBLIC_SITE_URL`; canonical URLs only emitted when set |
| Founder names, bios, photos | No production records; demo placeholders only |
| Projects | No production records; demo placeholders only |
| Research articles | No production records; one demo article |
| Expertise areas | Six suggested areas recorded as `unverified` drafts — hidden until a founder confirms them |
| Contact address | `null` — contact page shows a "not configured" state until set |
| Email delivery provider | Resend via REST, enabled only when env vars are present |
| Social links | Empty |

## Success criteria
See `docs/QA_REPORT.md` for the executed checks and the definition-of-done status.
