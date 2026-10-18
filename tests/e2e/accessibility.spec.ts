import { expect, test } from "@playwright/test";
import { allPages, axeViolations } from "./helpers";

/**
 * Automated WCAG 2.2 A/AA checks with axe-core. Automated checks cover only part of WCAG;
 * see docs/QA_REPORT.md for the manual checks performed.
 */
for (const theme of ["dark", "light"] as const) {
  test.describe(`axe — ${theme} theme`, () => {
    test.use({ colorScheme: theme, reducedMotion: "reduce" });
    for (const path of allPages()) {
      test(`${path}`, async ({ page }) => {
        await page.goto(path);
        expect(await axeViolations(page)).toEqual([]);
      });
    }
  });
}

test.describe("axe — mobile with menu open", () => {
  test.use({ viewport: { width: 375, height: 800 }, reducedMotion: "reduce" });
  test("menu dialog has no violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });
});

test.describe("keyboard", () => {
  test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("focus indicator is visible on links", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // brand link
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
    });
    expect(outline.style).not.toBe("none");
    expect(outline.width).toBeGreaterThanOrEqual(2);
  });

  test("page is usable at 200% text zoom without horizontal scroll (reflow at 640px)", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 });
    await page.goto("/");
    await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
