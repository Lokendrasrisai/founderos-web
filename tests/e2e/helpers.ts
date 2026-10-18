import { test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export type Mode = "production" | "preview" | "form";
export const mode = (process.env.E2E_MODE ?? "production") as Mode;

/** Skip the current describe block unless running in one of the given modes. */
export function onlyIn(...modes: Mode[]) {
  test.skip(!modes.includes(mode), `runs in ${modes.join("/")} mode only`);
}

export const corePages = ["/", "/about", "/join", "/contact", "/privacy"];
export const contentPages = ["/expertise", "/work", "/research"];
export const previewDetailPages = ["/work/demo-offline-field-sync", "/research/demo-governed-content"];

export const allPages = (): string[] => [
  ...corePages,
  ...contentPages,
  ...(mode === "preview" ? previewDetailPages : []),
];

export const widths = [320, 375, 430, 768, 1024, 1440, 1920];

export async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
  }));
}

/** Collect console errors and uncaught exceptions for the page lifetime. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}
