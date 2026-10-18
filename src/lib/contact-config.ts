import { site } from "@/config/site";

export type ContactMode =
  /** Server-side delivery configured: the form is shown and actually sends. */
  | { kind: "form" }
  /** No delivery backend, but a real public address is configured. */
  | { kind: "mailto"; email: string }
  /** Nothing configured. Say so plainly. */
  | { kind: "unconfigured" };

export interface ContactDeliveryEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

export function isDeliveryConfigured(env: ContactDeliveryEnv = process.env as ContactDeliveryEnv): boolean {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL);
}

export function getContactMode(
  env: ContactDeliveryEnv = process.env as ContactDeliveryEnv,
  publicEmail: string | null = site.contact.email,
): ContactMode {
  if (isDeliveryConfigured(env)) return { kind: "form" };
  if (publicEmail) return { kind: "mailto", email: publicEmail };
  return { kind: "unconfigured" };
}
