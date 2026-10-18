import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getExpertiseName, getFoundersBySlugs, getProject, getProjects, previewLabel } from "@/lib/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CoverArt } from "@/components/visuals/CoverArt";
import { TechList } from "@/components/cards/ProjectCard";
import { PreviewBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/States";
import type { CaseStudy } from "@/types/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/work/${project.slug}`,
    type: "article",
    noIndex: previewLabel(project.governance) !== null,
  });
}

const sections: Array<{ key: keyof CaseStudy; title: string }> = [
  { key: "context", title: "Context" },
  { key: "problem", title: "Problem" },
  { key: "approach", title: "Approach" },
  { key: "architecture", title: "Architecture" },
  { key: "implementation", title: "Implementation" },
  { key: "verification", title: "Verification" },
  { key: "outcomes", title: "Outcomes" },
  { key: "lessons", title: "Lessons learned" },
];

const permissionNote: Record<string, string | null> = {
  "own-work": null,
  "permission-granted": "Published with the permission of the organization the work was done for.",
  "permission-pending": null,
};

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const contributors = getFoundersBySlugs(project.contributors);
  const all = getProjects();
  const next = all.length > 1 ? all[(all.findIndex((p) => p.slug === project.slug) + 1) % all.length] : null;
  const present = sections.filter((s) => project.caseStudy[s.key].length > 0);
  const links = [
    project.links.source && { label: "Source code", href: project.links.source },
    project.links.demo && { label: "Live demo", href: project.links.demo },
    project.links.writeup && { label: "Write-up", href: project.links.writeup },
  ].filter((l): l is { label: string; href: string } => Boolean(l));
  const label = previewLabel(project.governance);

  return (
    <article>
      <header className="container-site pt-10 sm:pt-14">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: project.title }]}
        />
        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <div className="lg:col-span-8">
            <p className="type-meta flex flex-wrap gap-x-3">
              <span>{project.year}</span>
              <span className="text-muted">{project.category}</span>
            </p>
            <h1 className="type-h1 mt-4 max-w-[20ch]">{project.title}</h1>
            <p className="type-lead measure mt-6">{project.summary}</p>
            <PreviewBadge label={label} className="mt-6" />
          </div>
        </div>
      </header>

      <div className="container-site mt-12">
        <div className="cover-frame aspect-[16/9] sm:aspect-[21/9]">
          <CoverArt cover={project.cover} priority sizes="100vw" />
        </div>
      </div>

      <div className="container-site mt-12 grid gap-12 pb-[var(--space-section)] lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <aside className="lg:col-span-4" aria-label="Project details">
          <div className="lg:sticky lg:top-24">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 text-sm lg:grid-cols-1">
              <Meta term="Role">{project.role}</Meta>
              {contributors.length > 0 && (
                <Meta term="Contributors">{contributors.map((c) => c.name).join(", ")}</Meta>
              )}
              <Meta term="Disciplines">
                {project.disciplines.map((d) => getExpertiseName(d) ?? d).join(", ")}
              </Meta>
              <Meta term="Year">{project.year}</Meta>
              <div className="col-span-2 lg:col-span-1">
                <dt className="type-label">Technologies</dt>
                <dd className="mt-2">
                  <TechList items={project.technologies} />
                </dd>
              </div>
              {links.length > 0 && (
                <div className="col-span-2 lg:col-span-1">
                  <dt className="type-label">Links</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {links.map((l) => (
                      <ButtonLink key={l.href} href={l.href} variant="secondary">
                        {l.label}
                      </ButtonLink>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            {present.length > 2 && (
              <nav
                aria-label="Case study sections"
                className="mt-8 hidden border-t border-line pt-6 lg:block"
              >
                <ol className="space-y-1.5 text-sm">
                  {present.map((s) => (
                    <li key={s.key}>
                      <a href={`#${s.key}`} className="text-muted hover:text-fg">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8 lg:col-start-5">
          {project.outcome && (
            <Callout title="Verified outcome" className="mb-12">
              {project.outcome}
            </Callout>
          )}
          {permissionNote[project.permission] && (
            <p className="mb-10 text-sm text-subtle">{permissionNote[project.permission]}</p>
          )}

          <ol className="space-y-14">
            {present.map((s, i) => (
              <li key={s.key} id={s.key} className="scroll-mt-24">
                <section
                  aria-labelledby={`${s.key}-title`}
                  className="grid gap-4 sm:grid-cols-[4rem_minmax(0,1fr)]"
                >
                  <span aria-hidden className="type-meta pt-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 id={`${s.key}-title`} className="type-h3">
                      {s.title}
                    </h2>
                    <div className="prose-site mt-4">
                      {project.caseStudy[s.key].map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                    {s.key === "architecture" && project.evidence && project.evidence.length > 0 && (
                      <div className="mt-8 grid gap-6">
                        {project.evidence.map((img) => (
                          <figure key={img.src}>
                            <Image
                              src={img.src}
                              alt={img.alt}
                              width={img.width}
                              height={img.height}
                              sizes="(min-width: 1024px) 60vw, 100vw"
                              className="rounded-[var(--radius-md)] border border-line"
                            />
                            <figcaption className="mt-2 text-sm text-subtle">{img.alt}</figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </li>
            ))}
          </ol>

          {next && next.slug !== project.slug && (
            <div className="mt-20 border-t border-line pt-8">
              <p className="type-label">Next project</p>
              <Link
                href={`/work/${next.slug}`}
                className="type-h3 mt-2 inline-block rounded-sm hover:text-accent"
              >
                {next.title}
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Meta({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="type-label">{term}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}
