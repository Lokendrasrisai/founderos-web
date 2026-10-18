import type { ReactNode } from "react";
import { cn } from "@/lib/utilities";

type Tone = "neutral" | "accent" | "warn";

const tones: Record<Tone, string> = {
  neutral: "border-line-strong text-muted",
  accent: "border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] text-accent",
  warn: "border-transparent bg-[var(--color-warn-bg)] text-[var(--color-warn-fg)]",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-xs)] border px-2 py-0.5 text-xs leading-5 font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Shown only in preview builds, on any record that is not approved and verified. */
export function PreviewBadge({ label, className }: { label: string | null; className?: string }) {
  if (!label) return null;
  return (
    <Badge tone="warn" className={className}>
      {label}
    </Badge>
  );
}
