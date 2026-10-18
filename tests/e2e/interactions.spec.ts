import { expect, test } from "@playwright/test";
import { onlyIn } from "./helpers";

test.describe("process explorer", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("follows the tabs pattern with arrow keys and Home/End", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", { name: "Process stages" });
    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(6);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Research");

    await page.keyboard.press("End");
    await expect(tabs.nth(5)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("the loop begins again");

    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    await tabs.nth(3).click();
    await expect(page.getByRole("tabpanel")).toContainText("Build");
  });

  test("mobile shows the full sequence without interaction", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const approach = page.locator("section#approach");
    for (const name of ["Discovery", "Research", "Design", "Build", "Validate", "Improve"]) {
      await expect(approach.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(approach.getByRole("tablist")).toBeHidden();
  });
});

test.describe("work filters", () => {
  onlyIn("preview");

  test("filters by discipline and type, announcing the count", async ({ page }) => {
    await page.goto("/work");
    const items = page.locator("main ul.grid > li");
    await expect(items).toHaveCount(3);
    await page
      .getByRole("group", { name: "Discipline" })
      .getByRole("button", { name: "Geospatial systems" })
      .click();
    await expect(items).toHaveCount(1);
    await expect(page.getByText("1 project shown")).toBeAttached();
    await page.getByRole("group", { name: "Type" }).getByRole("button", { name: "Open source" }).click();
    await expect(page.getByText("No projects match both filters.")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(items).toHaveCount(3);
    await expect(
      page.getByRole("group", { name: "Discipline" }).getByRole("button", { name: "All" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("research article", () => {
  onlyIn("preview");

  test("table of contents targets real headings; code and tables render", async ({ page }) => {
    await page.goto("/research/demo-governed-content");
    const toc = page.getByRole("navigation", { name: "On this page" });
    const links = toc.getByRole("link");
    expect(await links.count()).toBeGreaterThanOrEqual(3);
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
      await expect(page.locator(`[id="${href!.slice(1)}"]`)).toHaveCount(1);
    }
    await expect(page.locator("pre code span[style]").first()).toBeAttached(); // syntax highlighted
    await expect(page.getByRole("region", { name: "Table" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "References" })).toBeVisible();
  });
});
