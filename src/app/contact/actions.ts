"use server";

import { headers } from "next/headers";
import { site } from "@/config/site";
import { isDeliveryConfigured } from "@/lib/contact-config";
import { createRateLimiter } from "@/lib/rate-limit";
import { isLikelyBot, sanitizeHeaderValue, validateContact, type FieldErrors } from "@/lib/validation";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  /** Echo of submitted values so the form keeps them after a server-side error. */
  values?: Record<string, string>;
}

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const GENERIC_FAILURE = "Your message wasn't sent. Please try again in a few minutes.";

function field(form: FormData, name: string): string {
  const v = form.get(name);
  return typeof v === "string" ? v : "";
}

/**
 * Contact form handler. Reports success only when the email provider accepted the message (HTTP 2xx).
 * Nothing is stored by this site; the message is forwarded once and discarded.
 */
export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = {
    name: field(form, "name"),
    email: field(form, "email"),
    organization: field(form, "organization"),
    subject: field(form, "subject"),
    message: field(form, "message"),
  };

  if (!isDeliveryConfigured()) {
    return { status: "error", message: "The contact form isn't configured on this site.", values };
  }

  if (isLikelyBot({ honeypot: field(form, "website"), renderedAt: field(form, "rendered_at") })) {
    return { status: "error", message: GENERIC_FAILURE, values };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const rate = limiter.check(ip);
  if (!rate.allowed) {
    const minutes = Math.max(1, Math.ceil(rate.retryAfterMs / 60000));
    return {
      status: "error",
      message: `Too many messages from your connection. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      values,
    };
  }

  const result = validateContact(values);
  if (!result.ok) {
    return { status: "error", message: "Check the highlighted fields.", errors: result.errors, values };
  }

  const { name, email, organization, subject, message } = result.data;
  const text = [
    `From: ${name} <${email}>`,
    organization ? `Organization: ${organization}` : null,
    "",
    message,
    "",
    `— Sent via the ${site.name} contact form`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    // RESEND_API_BASE exists only so tests can point delivery at a local mock.
    const base =
      (process.env.VERCEL_ENV !== "production" && process.env.RESEND_API_BASE) || "https://api.resend.com";
    const res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: sanitizeHeaderValue(`[${site.shortName}] ${subject}`).slice(0, 200),
        text,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) {
      // Log status only — never the visitor's message or address.
      console.error(`[contact] delivery failed with status ${res.status}`);
      return { status: "error", message: GENERIC_FAILURE, values };
    }
  } catch (err) {
    console.error(`[contact] delivery error: ${err instanceof Error ? err.name : "unknown"}`);
    return { status: "error", message: GENERIC_FAILURE, values };
  }

  return { status: "success", message: "Message sent. We read every note and reply when we can help." };
}
