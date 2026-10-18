/**
 * The ONLY module that decides what content is public.
 * Components never import from src/content directly.
 */
import { articles, demoArticles } from "@/content/research";
import { demoFounders } from "@/content/founders/demo";
import { founders } from "@/content/founders";
import { demoProjects } from "@/content/projects/demo";
import { projects } from "@/content/projects";
import { expertise } from "@/content/expertise";
import type { ArticleMeta, ExpertiseArea, Founder, Governance, Project } from "@/types/content";

export interface ContentEnv {
  FOUNDEROS_DEMO_CONTENT?: string;
  VERCEL_ENV?: string;
}

/**
 * Preview mode shows drafts and DEMO_ONLY fixtures (badged) for design and editorial review.
 * It is never active on a production deployment.
 */
export function isPreviewMode(env: ContentEnv = process.env as ContentEnv): boolean {
  return env.FOUNDEROS_DEMO_CONTENT === "true" && env.VERCEL_ENV !== "production";
}

/** A record is public when it is both approved and verified. */
export function isPublished(g: Governance): boolean {
  return g.approval === "approved" && g.verification === "verified";
}

export function isVisible(g: Governance, preview: boolean = isPreviewMode()): boolean {
  return isPublished(g) || preview;
}

/** Status shown as a badge in preview mode. Null for published records. */
export function previewLabel(g: Governance): string | null {
  if (isPublished(g)) return null;
  if (g.approval === "demo") return "Demo content";
  if (g.approval === "draft") return "Draft · unverified";
  return "Not approved";
}

function canPublishProject(p: Project): boolean {
  return p.permission !== "permission-pending";
}

/* ---------------------------------- Founders --------------------------------- */

export function getFounders(preview = isPreviewMode()): Founder[] {
  const pool = preview ? [...founders, ...demoFounders] : founders;
  return pool.filter((f) => isVisible(f.governance, preview)).sort((a, b) => a.order - b.order);
}

export function getFoundersBySlugs(slugs: string[], preview = isPreviewMode()): Founder[] {
  const all = getFounders(preview);
  return slugs.map((s) => all.find((f) => f.slug === s)).filter((f): f is Founder => Boolean(f));
}

/* ---------------------------------- Projects --------------------------------- */

export function getProjects(preview = isPreviewMode()): Project[] {
  const pool = preview ? [...projects, ...demoProjects] : projects;
  return pool
    .filter((p) => isVisible(p.governance, preview) && canPublishProject(p))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.year - a.year);
}

export function getProject(slug: string, preview = isPreviewMode()): Project | undefined {
  return getProjects(preview).find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit = 3, preview = isPreviewMode()): Project[] {
  return getProjects(preview).slice(0, limit);
}

/* --------------------------------- Expertise --------------------------------- */

export function getExpertise(preview = isPreviewMode()): ExpertiseArea[] {
  return expertise.filter((e) => isVisible(e.governance, preview)).sort((a, b) => a.order - b.order);
}

/** Display label for a discipline slug (a label only — makes no claim, so drafts are fine). */
export function getExpertiseName(slug: string): string | undefined {
  return expertise.find((e) => e.slug === slug)?.name;
}

/** Example projects for an area, restricted to projects that are themselves visible. */
export function getExampleProjects(area: ExpertiseArea, preview = isPreviewMode()): Project[] {
  const visible = getProjects(preview);
  return area.exampleProjects
    .map((s) => visible.find((p) => p.slug === s))
    .filter((p): p is Project => Boolean(p));
}

/* ---------------------------------- Research --------------------------------- */

export function getArticles(preview = isPreviewMode()): ArticleMeta[] {
  const pool = preview ? [...articles, ...demoArticles] : articles;
  return pool
    .filter((a) => isVisible(a.governance, preview))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticle(slug: string, preview = isPreviewMode()): ArticleMeta | undefined {
  return getArticles(preview).find((a) => a.slug === slug);
}

/* --------------------------------- Site shape -------------------------------- */

/** Which top-level sections have something truthful to show. Drives navigation and the sitemap. */
export function getSectionAvailability(preview = isPreviewMode()) {
  return {
    expertise: getExpertise(preview).length > 0,
    work: getProjects(preview).length > 0,
    research: getArticles(preview).length > 0,
    team: getFounders(preview).length > 0,
  };
}
