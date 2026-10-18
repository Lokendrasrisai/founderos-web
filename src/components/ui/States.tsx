import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utilities";

/** Callout: a short, bordered note. `tone="warn"` for things the reader must know. */
export function Callout({
  title,
  children,
  tone = "info",
  className,
}: {
  title?: string;
  children: ReactNode;
  tone?: "info" | "warn";
  className?: string;
}) {
  const Icon = tone === "warn" ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[var(--radius-md)] border p-4 sm:p-5",
        tone === "warn"
          ? "border-transparent bg-[var(--color-warn-bg)] text-[var(--color-warn-fg)]"
          : "border-line bg-surface text-muted",
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <div className="text-sm leading-relaxed">
        {title && <p className="mb-1 font-medium text-[inherit]">{title}</p>}
        <div className={tone === "info" ? "text-muted" : undefined}>{children}</div>
      </div>
    </div>
  );
}

/**
 * EmptyState: a truthful explanation of why something isn't here, and what to do instead.
 * Never "Coming soon".
 */
export function EmptyState({
  title,
  children,
  action,
  className,
  headingLevel = 2,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  headingLevel?: 2 | 3;
}) {
  const H = headingLevel === 3 ? "h3" : "h2";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-10 sm:px-10 sm:py-14",
        className,
      )}
    >
      <EmptyGlyph />
      <H className="type-h3 relative max-w-[28ch]">{title}</H>
      <div className="relative mt-3 max-w-[56ch] text-muted">{children}</div>
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}

function EmptyGlyph() {
  // A sparse grid of unconnected points: structure not yet filled in.
  const dots = [];
  for (let x = 0; x < 6; x++) for (let y = 0; y < 4; y++) dots.push([x * 22 + 6, y * 22 + 6]);
  return (
    <svg
      aria-hidden
      viewBox="0 0 122 78"
      className="pointer-events-none absolute top-6 right-6 hidden w-28 text-line-strong sm:block"
    >
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill="currentColor" />
      ))}
    </svg>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-16 text-muted">
      <span className="relative flex size-2.5">
        <span className="absolute inset-0 rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
        <span className="relative size-2.5 rounded-full bg-accent" />
      </span>
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function ErrorState({
  title = "This page didn't load.",
  children,
  action,
}: {
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div role="alert" className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-10">
      <h2 className="type-h3">{title}</h2>
      <div className="mt-3 max-w-[56ch] text-muted">
        {children ?? "Something went wrong while rendering this page. Try again, or return to the homepage."}
      </div>
      {action && <div className="mt-6 flex flex-wrap gap-3">{action}</div>}
    </div>
  );
}
