import Link from "next/link";
import { aboutCopy, principles } from "@/content/copy";
import { pageMetadata } from "@/lib/metadata";
import { getArticles, getExpertise, getFounders, getProjects } from "@/lib/content";
import { PageIntro } from "@/components/sections/PageIntro";
import { Team } from "@/components/sections/Team";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { SectionContainer, SectionHeading } from "@/components/ui/Section";

export const metadata = pageMetadata({
  title: "About",
  description: aboutCopy.intro.body,
  path: "/about",
});

/**
 * About: a narrative that keeps four things apart — what we've done, what we can demonstrate,
 * what we're exploring, and what we aspire to. The first two are populated from governed records only.
 */
export default function AboutPage() {
  const projects = getProjects();
  const articles = getArticles();
  const expertise = getExpertise();
  const founders = getFounders();

  const done = projects.map((p) => ({ label: p.title, href: `/work/${p.slug}` }));
  const demonstrable = [
    ...projects.flatMap((p) =>
      [
        p.links.source && { label: `${p.title} — source`, href: p.links.source },
        p.links.demo && { label: `${p.title} — demo`, href: p.links.demo },
      ].filter((x): x is { label: string; href: string } => Boolean(x)),
    ),
    ...articles.map((a) => ({ label: a.title, href: `/research/${a.slug}` })),
  ];

  return (
    <>
      <PageIntro
        label={aboutCopy.intro.label}
        title={aboutCopy.intro.headline}
        intro={aboutCopy.intro.body}
        crumbs={[{ label: "About" }]}
      />

      <SectionContainer labelledBy="motivation-title">
        <div className="grid-editorial">
          <p className="type-label pt-2">{aboutCopy.motivation.label}</p>
          <div>
            <h2 id="motivation-title" className="type-h2 max-w-[22ch]">
              {aboutCopy.motivation.headline}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-[var(--gutter)]">
              {aboutCopy.motivation.paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer labelledBy="principles-title">
        <SectionHeading id="principles-title" label="Principles" title="What we hold each other to." />
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-[var(--gutter)]">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t border-line-strong pt-6">
              <p className="type-meta">Principle {i + 1}</p>
              <h3 className="type-h3 mt-3">{p.title}</h3>
              <p className="mt-3 text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </SectionContainer>

      <Team founders={founders} detailed />

      <SectionContainer labelledBy="ledger-title">
        <SectionHeading
          id="ledger-title"
          label="Status"
          title="Fact, evidence, intent."
          intro="We keep these apart on purpose. The first two columns are filled only from records we have verified; the last two are statements of intent."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          <LedgerColumn
            title="What we have done"
            kind="fact"
            items={done}
            empty="No completed project has been verified for publication yet."
          />
          <LedgerColumn
            title="What we can demonstrate"
            kind="fact"
            items={demonstrable}
            empty="Nothing public to link to yet. Source code, demos and writing will be listed here as they are approved."
          />
          <LedgerColumn
            title="What we are exploring"
            kind="intent"
            items={[
              ...aboutCopy.exploring.map((label) => ({ label })),
              ...expertise.flatMap((e) => e.researchDirections.map((label) => ({ label }))),
            ]}
          />
          <LedgerColumn
            title="What we aspire to"
            kind="intent"
            items={aboutCopy.aspirations.map((label) => ({ label }))}
          />
        </div>
      </SectionContainer>

      <ClosingCta />
    </>
  );
}

function LedgerColumn({
  title,
  kind,
  items,
  empty,
}: {
  title: string;
  kind: "fact" | "intent";
  items: Array<{ label: string; href?: string }>;
  empty?: string;
}) {
  return (
    <section aria-label={title} className="bg-bg p-6 sm:p-8">
      <p className="type-meta">{kind === "fact" ? "Verified record" : "Intent"}</p>
      <h3 className="type-h3 mt-2 text-[1.125rem]">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.label} className="flex gap-2.5">
              <span
                aria-hidden
                className={
                  kind === "fact"
                    ? "mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent"
                    : "mt-[0.45rem] size-1.5 shrink-0 rounded-full border border-steel"
                }
              />
              {item.href ? (
                item.href.startsWith("/") ? (
                  <Link href={item.href} className="link">
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                    {item.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )
              ) : (
                <span className="text-muted">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-muted">{empty}</p>
      )}
    </section>
  );
}
