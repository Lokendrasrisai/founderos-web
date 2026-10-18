import { expect, test } from "@playwright/test";
import { allPages, trackErrors, widths } from "./helpers";

test.describe("every page renders", () => {
  for (const path of allPages()) {
    test(`${path} — 200, one h1, title, landmarks, no console errors`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.title()).toMatch(/\S/);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }

  test("unknown routes return the custom 404", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/isn.t here/);
    const meta = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(meta).toMatch(/noindex/);
  });

  test("unknown project and article slugs 404", async ({ page }) => {
    expect((await page.goto("/work/not-a-project"))?.status()).toBe(404);
    expect((await page.goto("/research/not-an-article"))?.status()).toBe(404);
  });
});

test.describe("responsive layout", () => {
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of allPages()) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} overflows at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("tap targets in the header are at least 40px tall on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const box = await page.getByRole("button", { name: "Open menu" }).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(40);
    expect(box!.width).toBeGreaterThanOrEqual(40);
  });
});

test.describe("internal links", () => {
  test("every internal link on every page resolves", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of allPages()) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        const [pathname, hash] = href.split("#");
        const target = pathname || path;
        if (!seen.has(target)) {
          seen.add(target);
          const res = await request.get(target);
          expect(res.status(), `${href} linked from ${path}`).toBe(200);
        }
        if (hash && (pathname === "" || pathname === path)) {
          await expect(page.locator(`[id="${hash}"]`), `#${hash} on ${path}`).toHaveCount(1);
        }
      }
    }
    expect(seen.size).toBeGreaterThan(3);
  });

  test("external links open safely", async ({ page }) => {
    for (const path of allPages()) {
      await page.goto(path);
      const unsafe = await page.$$eval('a[href^="http"]', (as) =>
        as
          .filter((a) => a.getAttribute("target") === "_blank")
          .filter((a) => !(a.getAttribute("rel") ?? "").includes("noopener"))
          .map((a) => a.getAttribute("href")),
      );
      expect(unsafe, path).toEqual([]);
    }
  });
});
