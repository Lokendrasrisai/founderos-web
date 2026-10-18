import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, isLikelyBot, sanitizeHeaderValue, validateContact } from "@/lib/validation";
import { createRateLimiter } from "@/lib/rate-limit";
import { getContactMode, isDeliveryConfigured } from "@/lib/contact-config";
import { extractToc, formatDate, readingTime, seededRandom, wordCount } from "@/lib/utilities";
import { copyrightHolder, entityStatement, site } from "@/config/site";
import { getArticleSourceStats } from "@/lib/article-source";

const valid = {
  name: "Ada",
  email: "ada@example.com",
  organization: "",
  subject: "Hello",
  message: "A message that is comfortably longer than twenty characters.",
};

describe("contact validation", () => {
  it("accepts a valid submission and trims values", () => {
    const r = validateContact({ ...valid, name: "  Ada  " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.name).toBe("Ada");
  });

  it("reports one message per invalid field", () => {
    const r = validateContact({ name: "", email: "nope", subject: "", message: "short" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name", "subject"]);
    }
  });

  it("enforces maximum lengths", () => {
    const r = validateContact({ ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) });
    expect(r.ok).toBe(false);
  });

  it("organization is optional", () => {
    const { organization: _omit, ...rest } = valid;
    void _omit;
    expect(validateContact(rest).ok).toBe(true);
  });

  it("strips newlines from header values", () => {
    expect(sanitizeHeaderValue("Hi\r\nBcc: x@y.z")).toBe("Hi Bcc: x@y.z");
  });
});

describe("bot heuristics", () => {
  const now = 1_000_000_000_000;
  it("flags a filled honeypot", () => {
    expect(isLikelyBot({ honeypot: "spam", renderedAt: String(now - 10_000) }, now)).toBe(true);
  });
  it("flags submissions that are too fast, missing, or stale", () => {
    expect(isLikelyBot({ honeypot: "", renderedAt: String(now - 500) }, now)).toBe(true);
    expect(isLikelyBot({ honeypot: "", renderedAt: "" }, now)).toBe(true);
    expect(isLikelyBot({ honeypot: "", renderedAt: String(now - 2 * 86_400_000) }, now)).toBe(true);
  });
  it("accepts a normal human pace", () => {
    expect(isLikelyBot({ honeypot: "", renderedAt: String(now - 30_000) }, now)).toBe(false);
  });
});

describe("rate limiter", () => {
  it("allows up to the limit per window, then resets", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("a", 0).allowed).toBe(true);
    expect(rl.check("a", 10).allowed).toBe(true);
    const blocked = rl.check("a", 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(980);
    expect(rl.check("b", 20).allowed).toBe(true);
    expect(rl.check("a", 1001).allowed).toBe(true);
  });
});

describe("contact mode", () => {
  const full = { RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "t@x.y", CONTACT_FROM_EMAIL: "f@x.y" };
  it("requires all three delivery variables", () => {
    expect(isDeliveryConfigured(full)).toBe(true);
    expect(isDeliveryConfigured({ ...full, RESEND_API_KEY: "" })).toBe(false);
  });
  it("falls back to mailto, then to an explicit unconfigured state", () => {
    expect(getContactMode(full, null)).toEqual({ kind: "form" });
    expect(getContactMode({}, "hello@x.y")).toEqual({ kind: "mailto", email: "hello@x.y" });
    expect(getContactMode({}, null)).toEqual({ kind: "unconfigured" });
  });
  it("ships with no invented contact address", () => {
    expect(site.contact.email).toBeNull();
  });
});

describe("site identity", () => {
  it("does not claim a legal entity", () => {
    expect(site.entity.status).toBe("not-formed");
    expect(copyrightHolder()).not.toMatch(/\b(Inc|LLC|Ltd|Corp)\b/);
    expect(entityStatement()).toMatch(/not yet a legal entity/);
  });
});

describe("utilities", () => {
  it("formats dates in UTC regardless of server timezone", () => {
    expect(formatDate("2026-01-01")).toBe("January 1, 2026");
    expect(formatDate("2026-01-01", "short")).toBe("Jan 1, 2026");
  });

  it("counts words outside code fences", () => {
    expect(wordCount("one two\n```\nnot counted here\n```\nthree")).toBe(3);
    expect(readingTime("word ".repeat(460))).toBe(2);
    expect(readingTime("")).toBe(1);
  });

  it("builds a table of contents with github-slugger ids", () => {
    const toc = extractToc(
      "# Title\n## Hello World\n```\n## not a heading\n```\n### Sub `code`\n## Hello World",
    );
    expect(toc).toEqual([
      { id: "hello-world", text: "Hello World", depth: 2 },
      { id: "sub-code", text: "Sub code", depth: 3 },
      { id: "hello-world-1", text: "Hello World", depth: 2 },
    ]);
  });

  it("produces deterministic random sequences", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("reads article stats from MDX and rejects unsafe slugs", () => {
    const stats = getArticleSourceStats("demo-governed-content");
    expect(stats.minutes).toBeGreaterThanOrEqual(1);
    expect(stats.toc.map((t) => t.id)).toContain("make-status-part-of-the-data");
    expect(() => getArticleSourceStats("../secrets")).toThrow();
  });
});
