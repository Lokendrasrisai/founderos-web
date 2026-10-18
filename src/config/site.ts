/**
 * Site identity — the single place to change the brand.
 *
 * Everything here is rendered publicly. Do not add facts that are not true today.
 * Founders, projects, expertise and research live in `src/content/**` (see docs/CONTENT_GUIDE.md).
 */

export type EntityStatus =
  /** No legal entity exists yet. Footer says so; no "Inc."/"LLC". */
  | { status: "not-formed" }
  /** Only set once the entity legally exists. */
  | { status: "formed"; legalName: string; jurisdiction: string };

export interface SocialLink {
  label: string;
  href: string;
}

export const site = {
  /** Working name. Replace freely; nothing else needs to change. */
  name: "FounderOS",
  /** Shown next to the monogram and in metadata. */
  shortName: "FounderOS",
  /** Two letters (or one glyph) rendered inside the monogram. */
  monogram: "F",
  /** Set to true while the name is a placeholder; adds a quiet note in the footer. */
  nameIsWorkingTitle: true,

  tagline: "Precision meets ambition.",
  description:
    "An emerging technology founding team exploring ambitious problems through engineering, research, and disciplined experimentation.",

  /**
   * Canonical origin. Leave unset until a domain is chosen; canonical URLs and absolute OG URLs are then
   * omitted rather than pointing at a guess. Set via NEXT_PUBLIC_SITE_URL (e.g. https://example.com).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || null,

  locale: "en_US",

  entity: { status: "not-formed" } as EntityStatus,

  contact: {
    /**
     * Public contact address. `null` until a real, monitored address exists.
     * Never put a guessed address here.
     */
    email: null as string | null,
    /** Typical response window shown on the contact page. Leave null rather than over-promise. */
    responseNote: null as string | null,
  },

  /** Public profiles of the team as a whole. Add only accounts that exist. */
  social: [] as SocialLink[],

  /** Privacy notice revision date (YYYY-MM-DD). Update whenever data practices change. */
  privacyLastUpdated: "2026-10-18",
} as const;

export function copyrightHolder(): string {
  return site.entity.status === "formed" ? site.entity.legalName : `The ${site.name} founding team`;
}

export function entityStatement(): string {
  if (site.entity.status === "formed") {
    return `${site.entity.legalName}, organized in ${site.entity.jurisdiction}.`;
  }
  return `${site.name}${site.nameIsWorkingTitle ? " is a working name and" : ""} is not yet a legal entity.`;
}
