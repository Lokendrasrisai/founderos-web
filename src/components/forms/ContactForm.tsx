"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { CONTACT_LIMITS, validateContact, type ContactField, type FieldErrors } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utilities";

const initial: ContactState = { status: "idle" };

/**
 * ContactForm: validated on the client for fast feedback and again on the server.
 * Labels are visible; errors are linked to their fields; the outcome is announced.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const renderedAt = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Stamp the time the form became interactive (the static HTML can't know it).
  useEffect(() => {
    if (renderedAt.current) renderedAt.current.value = String(Date.now());
  }, []);

  // Move focus to the outcome so screen reader and keyboard users land on it.
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const errors: FieldErrors = { ...state.errors, ...clientErrors };
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-[var(--radius-lg)] border border-line bg-surface p-8 outline-none sm:p-10"
      >
        <CheckCircle2 aria-hidden className="size-6 text-[var(--color-success)]" strokeWidth={1.75} />
        <h2 className="type-h3 mt-4">Message sent.</h2>
        <p className="mt-2 max-w-[48ch] text-muted">{state.message}</p>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const result = validateContact(data);
    if (!result.ok) {
      e.preventDefault();
      setClientErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
    } else {
      setClientErrors({});
    }
  }

  return (
    <form action={action} onSubmit={onSubmit} noValidate className="grid gap-6" aria-describedby="form-note">
      {state.status === "error" && state.message && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-danger)_50%,transparent)] p-4 text-sm text-[var(--color-danger)] outline-none"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          name="name"
          label="Name"
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name}
          required
          error={errors.name}
          defaultValue={values.name}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={CONTACT_LIMITS.email}
          required
          error={errors.email}
          defaultValue={values.email}
        />
      </div>
      <Field
        name="organization"
        label="Organization"
        optional
        autoComplete="organization"
        maxLength={CONTACT_LIMITS.organization}
        error={errors.organization}
        defaultValue={values.organization}
      />
      <Field
        name="subject"
        label="Subject"
        maxLength={CONTACT_LIMITS.subject}
        required
        error={errors.subject}
        defaultValue={values.subject}
      />
      <Field
        name="message"
        label="Message"
        multiline
        required
        maxLength={CONTACT_LIMITS.message}
        hint={`At least ${CONTACT_LIMITS.messageMin} characters.`}
        error={errors.message}
        defaultValue={values.message}
      />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input ref={renderedAt} type="hidden" name="rendered_at" defaultValue="" />

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="max-w-[46ch] text-sm text-subtle">
          We use your details only to reply. See the{" "}
          <a href="/privacy" className="link">
            privacy notice
          </a>
          .
        </p>
        <Button type="submit" size="lg" disabled={pending} aria-disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  multiline,
  optional,
  required,
  hint,
  error,
  defaultValue,
  ...rest
}: {
  name: ContactField;
  label: string;
  type?: string;
  multiline?: boolean;
  optional?: boolean;
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = [hint && !error && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const control = cn(
    "w-full rounded-[var(--radius-sm)] border bg-surface px-3.5 text-[1rem] text-fg placeholder:text-subtle",
    "transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1",
    error
      ? "border-[var(--color-danger)]"
      : "border-line-strong hover:border-[color-mix(in_srgb,var(--color-fg)_35%,transparent)]",
  );
  const common = {
    id: name,
    name,
    required,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    defaultValue,
    ...rest,
  };
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-subtle"> (optional)</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={7} className={cn(control, "min-h-40 resize-y py-3 leading-relaxed")} />
      ) : (
        <input {...common} type={type} className={cn(control, "h-12")} />
      )}
      {hint && !error && (
        <p id={hintId} className="text-sm text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
