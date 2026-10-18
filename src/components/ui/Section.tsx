import type { ReactNode } from "react";
import { cn } from "@/lib/utilities";

/**
 * SectionContainer: a page section with consistent vertical rhythm and a top rule.
 * Pass `labelledBy` to the id of the section's heading.
 */
export function SectionContainer({
  id,
  labelledBy,
  children,
  className,
  rule = true,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("section-y", className)}>
      <div className="container-site">
        <div className={cn(rule && "rule-top pt-[var(--space-block)]")}>{children}</div>
      </div>
    </section>
  );
}

/**
 * SectionHeading: the section's name sits in the margin column; the headline and intro in the content
 * column. Use inside `.grid-editorial` or on its own (it creates the grid).
 */
export function SectionHeading({
  id,
  label,
  title,
  intro,
  as: Tag = "h2",
  action,
}: {
  id: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  action?: ReactNode;
}) {
  return (
    <div className="grid-editorial items-start">
      <p className="type-label pt-1 md:pt-2">{label}</p>
      <div>
        <Tag id={id} className={cn(Tag === "h1" ? "type-h1" : "type-h2", "max-w-[22ch]")}>
          {title}
        </Tag>
        {intro && <div className="type-lead measure mt-5">{intro}</div>}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  );
}
