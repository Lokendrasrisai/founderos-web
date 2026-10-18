import { expect, test } from "@playwright/test";
import { allPages, mode, onlyIn } from "./helpers";

/** What the public (production) build must and must not say. */
test.describe("production build", () => {
  onlyIn("production", "form");

  test("no fixture, placeholder, or entity claims anywhere", async ({ page }) => {
    for (const path of allPages()) {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      for (const banned of [
        /Founder [A-D]\b/,
        /Demo content/,
        /\bPlaceholder\b/,
        /Preview build/,
        /\bInc\.?\b/,
        /\bLLC\b/,
        /coming soon/i,
      ]) {
        expect(text, `${banned} on ${path}`).not.toMatch(banned);
      }
    }
  });

  test("navigation omits sections with nothing published", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link")).toHaveText(["About", "Contact"]);
  });

  test("homepage omits empty sections and CTAs point at real content", async ({ page }) => {
    await page.goto("/");
    for (const id of ["work", "research", "expertise", "team"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(0);
    }
    await expect(page.getByRole("link", { name: "Explore our work" })).toHaveCount(0);
    await expect(page.locator("section#philosophy")).toHaveCount(1);
  });

  test("empty collection pages explain themselves truthfully", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByText(/No project is published until it.s verified/)).toBeVisible();
    await page.goto("/research");
    await expect(page.getByText("Nothing has been published yet.")).toBeVisible();
    await page.goto("/expertise");
    await expect(page.getByText(/No capability is listed until a founder has confirmed it/)).toBeVisible();
    await page.goto("/about");
    await expect(page.getByText(/Profiles are being written by the founders themselves/)).toBeVisible();
  });

  test("footer states entity status accurately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText("is not yet a legal entity");
  });

  test("pages are indexable and robots allows crawling", async ({ page, request }) => {
    await page.goto("/");
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toMatch(/^index/);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Allow: \//);
    const res = await request.get("/");
    expect(res.headers()["x-robots-tag"]).toBeUndefined();
  });

  test("no canonical URL is invented while no domain is configured", async ({ page, request }) => {
    test.skip(Boolean(process.env.NEXT_PUBLIC_SITE_URL), "domain configured");
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("<url>");
  });

  test("security headers are sent", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});

test.describe("contact behaviour without a delivery backend", () => {
  onlyIn("production");
  test("shows an explicit not-configured state and no form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Contact details haven't been published yet.")).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
  });
});

test.describe("preview build", () => {
  onlyIn("preview");

  test("every page carries the preview banner and noindex", async ({ page, request }) => {
    for (const path of allPages()) {
      await page.goto(path);
      await expect(page.getByText("Preview build.")).toBeVisible();
      expect(await page.locator('meta[name="robots"]').getAttribute("content"), path).toMatch(/noindex/);
    }
    expect((await request.get("/")).headers()["x-robots-tag"]).toMatch(/noindex/);
    expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
  });

  test("every fixture is visibly badged", async ({ page }) => {
    await page.goto("/");
    expect(await page.getByText("Demo content").count()).toBeGreaterThanOrEqual(7);
    await expect(page.getByText("Draft · unverified").first()).toBeVisible();
  });
});

test("mode sanity", async () => {
  expect(["production", "preview", "form"]).toContain(mode);
});
