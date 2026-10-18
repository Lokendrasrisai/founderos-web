import { afterEach, describe, expect, it, vi } from "vitest";

describe("next.config guardrail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("refuses to build demo content for a production deployment", async () => {
    vi.stubEnv("FOUNDEROS_DEMO_CONTENT", "true");
    vi.stubEnv("VERCEL_ENV", "production");
    await expect(import("../../../next.config")).rejects.toThrow(/not allowed on a production deployment/);
  });

  it("sends a noindex header on preview builds", async () => {
    vi.stubEnv("FOUNDEROS_DEMO_CONTENT", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    const config = (await import("../../../next.config")).default;
    const headers = await config.headers!();
    expect(JSON.stringify(headers)).toContain("noindex");
  });

  it("sets security headers on normal builds", async () => {
    const config = (await import("../../../next.config")).default;
    const headers = JSON.stringify(await config.headers!());
    for (const h of [
      "Content-Security-Policy",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "X-Frame-Options",
    ]) {
      expect(headers).toContain(h);
    }
    expect(headers).not.toContain("noindex");
  });
});
