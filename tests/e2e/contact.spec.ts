import { createServer, type Server } from "node:http";
import { expect, test } from "@playwright/test";
import { onlyIn, trackErrors } from "./helpers";

/**
 * Runs with delivery configured (E2E_MODE=form) against a local mock of the provider API,
 * so success is only shown when the provider answers 2xx.
 */
test.describe("contact form with delivery configured", () => {
  onlyIn("form");
  test.describe.configure({ mode: "serial" });

  let server: Server;
  const received: Array<Record<string, unknown>> = [];

  test.beforeAll(async () => {
    server = createServer((req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        const json = JSON.parse(body || "{}");
        received.push(json);
        const fail = String(json.subject ?? "").includes("FAIL");
        res.writeHead(fail ? 500 : 200, { "content-type": "application/json" });
        res.end(JSON.stringify(fail ? { error: "mock failure" } : { id: "mock" }));
      });
    });
    await new Promise<void>((r) => server.listen(Number(process.env.MOCK_PROVIDER_PORT ?? 4010), r));
  });

  test.afterAll(() => new Promise<void>((r) => server.close(() => r())));

  async function fill(page: import("@playwright/test").Page, subject: string) {
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Subject").fill(subject);
    await page.getByLabel("Message").fill("I would like to compare notes on reliable data pipelines.");
  }

  test("client validation links errors to fields", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Send message" }).click();
    const name = page.getByLabel("Name");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Please enter your name.");
    await expect(page.getByLabel("Email")).toHaveAccessibleDescription("Please enter a valid email address.");
    expect(received).toHaveLength(0);
  });

  test("shows success only after the provider accepts the message", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/contact");
    await fill(page, "Hello from the test");
    await page.waitForTimeout(2700); // minimum human fill time
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Message sent.");
    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({ reply_to: "ada@example.com" });
    expect(String(received[0].subject)).toContain("Hello from the test");
    expect(errors).toEqual([]);
  });

  test("reports failure and keeps the message when the provider fails", async ({ page }) => {
    await page.goto("/contact");
    await fill(page, "Please FAIL");
    await page.waitForTimeout(2700);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "wasn't sent" })).toBeVisible();
    await expect(page.getByText("Message sent.")).toHaveCount(0);
    await expect(page.getByLabel("Message")).toHaveValue(/compare notes/);
  });

  test("rejects submissions that arrive too fast to be human", async ({ page }) => {
    const before = received.length;
    await page.goto("/contact");
    await fill(page, "Fast bot");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "wasn't sent" })).toBeVisible();
    expect(received.length).toBe(before);
  });

  test("privacy notice describes the form's data handling", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByText(/through our email delivery provider \(Resend\)/)).toBeVisible();
  });
});
