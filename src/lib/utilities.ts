import GithubSlugger from "github-slugger";

/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Formats an ISO date (YYYY-MM-DD) deterministically in UTC so server and client agree. */
export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Strips fenced code blocks so headings/words inside code are not counted. */
function stripCode(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
}

export function wordCount(markdown: string): number {
  const text = stripCode(markdown)
    .replace(/^import .*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_|\-[\]()]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time in whole minutes at ~230 wpm, minimum 1. */
export function readingTime(markdown: string, wpm = 230): number {
  return Math.max(1, Math.round(wordCount(markdown) / wpm));
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

/**
 * Extracts h2/h3 headings from MDX source and slugs them exactly like rehype-slug (github-slugger),
 * so the table of contents links match the rendered heading ids.
 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const source = markdown.replace(/```[\s\S]*?```/g, "");
  for (const line of source.split("\n")) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const text = match[2]
      .replace(/`/g, "")
      .replace(/\*\*|__|\*|_/g, "")
      .trim();
    const id = slugger.slug(text); // slug every heading to keep the counter in sync with rehype-slug
    if (depth === 2 || depth === 3) items.push({ id, text, depth });
  }
  return items;
}

/** Deterministic PRNG (mulberry32) for stable generated artwork. */
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
