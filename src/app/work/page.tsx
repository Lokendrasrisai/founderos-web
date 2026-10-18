import { pageMetadata } from "@/lib/metadata";
import { getExpertiseName, getProjects } from "@/lib/content";
import { PageIntro } from "@/components/sections/PageIntro";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import type { ProjectType } from "@/types/content";

export const metadata = pageMetadata({
  title: "Work",
  description: "Selected projects and technical work, with roles and outcomes stated plainly.",
  path: "/work",
});

const typeLabels: Record<ProjectType, string> = {
  product: "Product",
  research: "Research",
  "open-source": "Open source",
  prototype: "Prototype",
  infrastructure: "Infrastructure",
};

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export default function WorkPage() {
  const projects = getProjects();

  const disciplineSlugs = [...new Set(projects.flatMap((p) => p.disciplines))];
  const disciplines = disciplineSlugs.map((s) => ({ value: s, label: getExpertiseName(s) ?? humanize(s) }));
  const types = [...new Set(projects.map((p) => p.type))].map((t) => ({ value: t, label: typeLabels[t] }));

  return (
    <>
      <PageIntro
        label="Work"
        title="Selected work."
        intro="Each project states who did what, the technologies involved, and outcomes only where they were measured."
        crumbs={[{ label: "Work" }]}
      />
      <div className="container-site pb-[var(--space-section)]">
        {projects.length === 0 ? (
          <EmptyState
            title="No project is published until it's verified — and ours aren't yet."
            action={
              <ButtonLink href="/contact" variant="secondary">
                Ask us about our work
              </ButtonLink>
            }
          >
            We only publish work we can evidence and have permission to share. Case studies will appear here
            once each one has been checked and approved.
          </EmptyState>
        ) : (
          <WorkGallery
            disciplines={disciplines}
            types={types}
            items={projects.map((p) => ({
              slug: p.slug,
              disciplines: p.disciplines,
              type: p.type,
              card: <ProjectCard project={p} />,
            }))}
          />
        )}
      </div>
    </>
  );
}
