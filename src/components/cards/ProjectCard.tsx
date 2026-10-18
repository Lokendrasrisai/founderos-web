import Link from "next/link";
import type { Project } from "@/types/content";
import { CoverArt } from "@/components/visuals/CoverArt";
import { PreviewBadge } from "@/components/ui/Badge";
import { previewLabel } from "@/lib/content";
import { cn } from "@/lib/utilities";

/**
 * ProjectCard. `feature` is a full-width editorial spread; `tile` is the compact gallery form.
 * The whole card is clickable via the title link's stretched hit area; the title remains the accessible name.
 */
export function ProjectCard({
  project,
  layout = "tile",
  headingLevel = 3,
  priority = false,
}: {
  project: Project;
  layout?: "feature" | "tile";
  headingLevel?: 2 | 3;
  priority?: boolean;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const href = `/work/${project.slug}`;
  const label = previewLabel(project.governance);

  if (layout === "feature") {
    return (
      <article className="group relative grid gap-6 md:grid-cols-12 md:gap-[var(--gutter)]">
        <div className="cover-frame md:col-span-7">
          <CoverArt cover={project.cover} priority={priority} />
        </div>
        <div className="flex flex-col md:col-span-5 md:py-2">
          <p className="type-meta flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{project.year}</span>
            <span className="text-muted">{project.category}</span>
          </p>
          <H className="type-h2 mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
            <Link href={href} className="card-link">
              {project.title}
            </Link>
          </H>
          <p className="mt-4 text-muted">{project.summary}</p>
          <TechList items={project.technologies} className="mt-6" />
          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm text-accent">Read the case study</span>
            <PreviewBadge label={label} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col">
      <div className="cover-frame aspect-[16/10]">
        <CoverArt cover={project.cover} sizes="(min-width: 768px) 45vw, 100vw" />
      </div>
      <p className="type-meta mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{project.year}</span>
        <span className="text-muted">{project.category}</span>
      </p>
      <H className="type-h3 mt-2">
        <Link href={href} className="card-link">
          {project.title}
        </Link>
      </H>
      <p className="mt-2.5 line-clamp-3 text-muted">{project.summary}</p>
      {label && <PreviewBadge label={label} className="mt-4 self-start" />}
    </article>
  );
}

export function TechList({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul aria-label="Technologies" className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((t) => (
        <li
          key={t}
          className="type-meta rounded-[var(--radius-xs)] border border-line px-2 py-0.5 text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
