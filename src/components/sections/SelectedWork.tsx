import type { Project } from "@/types/content";
import { SectionContainer, SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";

/** Selected work: one full-width feature, then a two-up gallery. Omitted when nothing is published. */
export function SelectedWork({ projects, total }: { projects: Project[]; total: number }) {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;
  return (
    <SectionContainer id="work" labelledBy="work-title">
      <SectionHeading
        id="work-title"
        label="Selected work"
        title="Evidence over adjectives."
        intro="Projects we can show, with our role stated plainly and outcomes only where they were measured."
      />
      <div className="mt-14 space-y-16">
        <ProjectCard project={lead} layout="feature" />
        {rest.length > 0 && (
          <div className="grid gap-x-[var(--gutter)] gap-y-14 md:grid-cols-2">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
      {total > projects.length && (
        <ButtonLink href="/work" variant="secondary" className="mt-12">
          All work ({total})
        </ButtonLink>
      )}
    </SectionContainer>
  );
}
