import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { extractToc, readingTime, type TocItem } from "@/lib/utilities";

const RESEARCH_DIR = path.join(process.cwd(), "src", "content", "research");

/**
 * Reads an article's MDX source at build time (all article pages are statically generated).
 * Used only for derived metadata: reading time and table of contents.
 */
export function getArticleSourceStats(slug: string): { minutes: number; toc: TocItem[] } {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid article slug: ${slug}`);
  const source = readFileSync(path.join(RESEARCH_DIR, `${slug}.mdx`), "utf8");
  return { minutes: readingTime(source), toc: extractToc(source) };
}
