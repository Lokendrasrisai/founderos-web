import { describe, expect, it } from "vitest";
import {
  getArticles,
  getExpertise,
  getFounders,
  getProjects,
  getSectionAvailability,
  isPreviewMode,
  isPublished,
  previewLabel,
} from "@/lib/content";
import { getPrimaryNav } from "@/config/navigation";
import { founders } from "@/content/founders";
import { demoFounders } from "@/content/founders/demo";
import { projects } from "@/content/projects";
import { demoProjects } from "@/content/projects/demo";
import { expertise } from "@/content/expertise";
import { articles, demoArticles } from "@/content/research";
import type { Governance } from "@/types/content";
import { existsSync } from "node:fs";
import path from "node:path";

const g = (over: Partial<Governance>): Governance => ({
  owner: "x",
  verification: "verified",
  approval: "approved",
  lastReviewed: "2026-01-01",
  ...over,
});

describe("publication gate", () => {
  it("publishes only approved + verified records", () => {
    expect(isPublished(g({}))).toBe(true);
    expect(isPublished(g({ verification: "unverified" }))).toBe(false);
    expect(isPublished(g({ verification: "placeholder" }))).toBe(false);
    expect(isPublished(g({ approval: "draft" }))).toBe(false);
    expect(isPublished(g({ approval: "demo" }))).toBe(false);
  });

  it("labels unpublished records in preview", () => {
    expect(previewLabel(g({}))).toBeNull();
    expect(previewLabel(g({ approval: "demo" }))).toBe("Demo content");
    expect(previewLabel(g({ approval: "draft", verification: "unverified" }))).toBe("Draft · unverified");
  });
});

describe("preview mode", () => {
  it("is off by default", () => {
    expect(isPreviewMode({})).toBe(false);
  });
  it("turns on only with the flag outside production", () => {
    expect(isPreviewMode({ FOUNDEROS_DEMO_CONTENT: "true" })).toBe(true);
    expect(isPreviewMode({ FOUNDEROS_DEMO_CONTENT: "true", VERCEL_ENV: "preview" })).toBe(true);
    expect(isPreviewMode({ FOUNDEROS_DEMO_CONTENT: "true", VERCEL_ENV: "production" })).toBe(false);
    expect(isPreviewMode({ FOUNDEROS_DEMO_CONTENT: "1" })).toBe(false);
  });
});

describe("production content never includes fixtures", () => {
  it("returns no demo or draft records when preview is off", () => {
    const all = [
      ...getFounders(false).map((r) => r.governance),
      ...getProjects(false).map((r) => r.governance),
      ...getExpertise(false).map((r) => r.governance),
      ...getArticles(false).map((r) => r.governance),
    ];
    for (const gov of all) expect(isPublished(gov)).toBe(true);
    const slugs = [...getFounders(false), ...getProjects(false), ...getArticles(false)].map((r) => r.slug);
    expect(slugs.some((s) => s.startsWith("demo-"))).toBe(false);
  });

  it("hides empty sections from navigation", () => {
    const available = getSectionAvailability(false);
    const nav = getPrimaryNav(false).map((n) => n.href);
    expect(nav.includes("/work")).toBe(available.work);
    expect(nav.includes("/research")).toBe(available.research);
    expect(nav.includes("/expertise")).toBe(available.expertise);
    expect(nav).toContain("/about");
    expect(nav).toContain("/contact");
  });

  it("shows fixtures in preview", () => {
    expect(getProjects(true).length).toBeGreaterThan(0);
    expect(getFounders(true).length).toBeGreaterThanOrEqual(4);
    expect(getPrimaryNav(true).map((n) => n.href)).toEqual([
      "/about",
      "/expertise",
      "/work",
      "/research",
      "/contact",
    ]);
  });
});

describe("content integrity", () => {
  const allProjects = [...projects, ...demoProjects];
  const allFounders = [...founders, ...demoFounders];
  const allArticles = [...articles, ...demoArticles];

  it("demo fixtures are marked DEMO_ONLY and never approved", () => {
    for (const r of [...demoProjects, ...demoFounders, ...demoArticles]) {
      expect(r.slug.startsWith("demo-")).toBe(true);
      expect(r.governance.approval).toBe("demo");
      expect(r.governance.notes).toMatch(/DEMO_ONLY/);
    }
  });

  it("production files contain no demo records", () => {
    for (const r of [...projects, ...founders, ...articles]) {
      expect(r.governance.approval).not.toBe("demo");
      expect(r.slug.startsWith("demo-")).toBe(false);
    }
  });

  it("slugs are unique and URL-safe", () => {
    for (const list of [allProjects, allFounders, allArticles, expertise]) {
      const slugs = list.map((r) => r.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("cross-references resolve", () => {
    const founderSlugs = new Set(allFounders.map((f) => f.slug));
    const projectSlugs = new Set(allProjects.map((p) => p.slug));
    const expertiseSlugs = new Set(expertise.map((e) => e.slug));
    for (const p of allProjects) {
      for (const c of p.contributors) expect(founderSlugs.has(c)).toBe(true);
      for (const d of p.disciplines) expect(expertiseSlugs.has(d)).toBe(true);
    }
    for (const a of allArticles) for (const au of a.authors) expect(founderSlugs.has(au)).toBe(true);
    for (const e of expertise) for (const ex of e.exampleProjects) expect(projectSlugs.has(ex)).toBe(true);
  });

  it("every article has an MDX body", () => {
    for (const a of allArticles) {
      expect(existsSync(path.join(process.cwd(), "src/content/research", `${a.slug}.mdx`))).toBe(true);
    }
  });

  it("images have alt text and links are https", () => {
    for (const p of allProjects) {
      expect(p.cover.alt.length).toBeGreaterThan(10);
      for (const href of Object.values(p.links)) if (href) expect(href).toMatch(/^https:\/\//);
    }
    for (const f of allFounders) {
      if (f.photo) expect(f.photo.alt.length).toBeGreaterThan(5);
      for (const href of Object.values(f.links)) if (href) expect(href).toMatch(/^https:\/\//);
    }
    for (const a of allArticles)
      for (const r of a.references) if (r.url) expect(r.url).toMatch(/^https:\/\//);
  });

  it("governance dates are valid ISO dates", () => {
    const all = [...allProjects, ...allFounders, ...allArticles, ...expertise];
    for (const r of all) expect(Number.isNaN(Date.parse(r.governance.lastReviewed))).toBe(false);
  });

  it("projects needing permission are never visible", () => {
    // A pending-permission project must stay hidden even if approved + verified.
    expect(getProjects(true).some((p) => p.permission === "permission-pending")).toBe(false);
  });
});
