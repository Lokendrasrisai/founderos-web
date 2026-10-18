import { z } from "zod";

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  organization: 160,
  subject: 160,
  message: 5000,
  messageMin: 20,
  /** Submissions faster than this (ms after render) are treated as automated. */
  minFillMs: 2500,
} as const;

const trimmed = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer.`);

export const contactSchema = z.object({
  name: trimmed(CONTACT_LIMITS.name, "Name").min(1, "Please enter your name."),
  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.email, "Email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  organization: trimmed(CONTACT_LIMITS.organization, "Organization").optional().default(""),
  subject: trimmed(CONTACT_LIMITS.subject, "Subject").min(1, "Please add a subject."),
  message: trimmed(CONTACT_LIMITS.message, "Message").min(
    CONTACT_LIMITS.messageMin,
    `Please write at least ${CONTACT_LIMITS.messageMin} characters so we can respond usefully.`,
  ),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type FieldErrors = Partial<Record<ContactField, string>>;

export function validateContact(
  input: Record<string, unknown>,
): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const result = contactSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/** Removes CR/LF so user input can never inject email headers. */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Anti-automation checks that don't require third-party scripts. */
export function isLikelyBot(fields: { honeypot: string; renderedAt: string }, now = Date.now()): boolean {
  if (fields.honeypot.trim() !== "") return true;
  const rendered = Number(fields.renderedAt);
  if (!Number.isFinite(rendered) || rendered <= 0) return true;
  const elapsed = now - rendered;
  // Too fast to be human, or a timestamp from the future / older than a day.
  return elapsed < CONTACT_LIMITS.minFillMs || elapsed > 24 * 60 * 60 * 1000;
}
