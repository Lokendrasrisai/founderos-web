import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { getExampleProjects, getExpertise, previewLabel } from "@/lib/content";
import { PageIntro } from "@/components/sections/PageIntro";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { PreviewBadge } from "@/components/ui/Badge";
import { TechList } from "@/components/cards/ProjectCard";

export const metadata = pageMetadata({
  title: "Expertise",
  description: "The disciplines our team can speak to from first-hand experience.",
  path: "/expertise",
});

export default function ExpertisePage() {
  const areas = getExpertise();

  return (
    <>
      <PageIntro
        label="Expertise"
        title="Capabilities, stated carefully."
        intro="What we understand, what we've used in depth, and where we want to go further. Nothing here describes a service we sell."
        crumbs={[{ label: "Expertise" }]}
      >
        {areas.length > 1 && (
          <nav aria-label="Areas on this page" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <li key={a.slug}>
                  <a
                    href={`#${a.slug}`}
                    className="inline-flex min-h-10 items-center rounded-[var(--radius-sm)] border border-line px-3 text-sm text-muted hover:border-line-strong hover:text-fg"
                  >
                    {a.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageIntro>

      <div className="container-site pb-[var(--space-section)]">
        {areas.length === 0 ? (
          <EmptyState
            title="No capability is listed until a founder has confirmed it."
            action={
              <ButtonLink href="/about" variant="secondary">
                Read about the team
              </ButtonLink>
            }
          >
            Each area of expertise on this page must be backed by real, first-hand experience. The areas are
            being reviewed now and will appear once each one is verified.
          </EmptyState>
        ) : (
          areas.map((area) => {
            const examples = getExampleProjects(area);
            return (
              <section
                key={area.slug}
                id={area.slug}
                aria-labelledby={`${area.slug}-title`}
                className="grid scroll-mt-24 gap-8 border-t border-line py-14 md:grid-cols-12 md:gap-[var(--gutter)]"
              >
                <div className="md:col-span-4">
                  <div className="md:sticky md:top-24">
                    <h2
                      id={`${area.slug}-title`}
                      className="type-h2 text-[clamp(1.5rem,1.25rem+1vw,2.125rem)]"
                    >
                      {area.name}
                    </h2>
                    <PreviewBadge label={previewLabel(area.governance)} className="mt-4" />
                  </div>
                </div>
                <div className="md:col-span-8 lg:col-span-7">
                  <p className="text-lg leading-relaxed">{area.overview}</p>
                  <dl className="mt-10 grid gap-x-[var(--gutter)] gap-y-9 sm:grid-cols-2">
                    <Detail term="Problems we understand">
                      <List items={area.problemsUnderstood} />
                    </Detail>
                    <Detail term="Relevant experience">
                      {area.relevantExperience.length > 0 ? (
                        <List items={area.relevantExperience} />
                      ) : (
                        <p className="text-sm text-muted">Not yet documented.</p>
                      )}
                    </Detail>
                    <Detail term="Technologies used in depth">
                      <TechList items={area.technologies} className="mt-1" />
                    </Detail>
                    {area.researchDirections.length > 0 && (
                      <Detail term="Where we want to go further">
                        <List items={area.researchDirections} />
                      </Detail>
                    )}
                    {examples.length > 0 && (
                      <Detail term="Example work" wide>
                        <ul className="space-y-2">
                          {examples.map((p) => (
                            <li key={p.slug}>
                              <Link href={`/work/${p.slug}`} className="link">
                                {p.title}
                              </Link>
                              <span className="text-sm text-subtle"> — {p.year}</span>
                            </li>
                          ))}
                        </ul>
                      </Detail>
                    )}
                  </dl>
                </div>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}

function Detail({ term, children, wide }: { term: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="type-label">{term}</dt>
      <dd className="mt-3">{children}</dd>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-[0.9375rem] text-muted">
      {items.map((i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden className="mt-[0.6rem] h-px w-2.5 shrink-0 bg-line-strong" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
