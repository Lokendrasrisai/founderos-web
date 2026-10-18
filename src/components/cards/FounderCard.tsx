import type { Founder } from "@/types/content";
import { Portrait } from "@/components/visuals/Portrait";
import { PreviewBadge } from "@/components/ui/Badge";
import { previewLabel } from "@/lib/content";

const linkLabels: Record<keyof Founder["links"], string> = {
  website: "Website",
  linkedin: "LinkedIn",
  github: "GitHub",
};

/** FounderCard: consistent portrait, name, public role, summary, and approved public links. */
export function FounderCard({ founder, detailed = false }: { founder: Founder; detailed?: boolean }) {
  const links = (Object.keys(linkLabels) as Array<keyof Founder["links"]>).filter((k) => founder.links[k]);
  const label = previewLabel(founder.governance);
  return (
    <article id={founder.slug} className="group scroll-mt-28">
      <Portrait founder={founder} />
      <div className="mt-5">
        <h3 className="type-h3 text-[1.25rem]">{founder.name}</h3>
        <p className="mt-1 text-sm text-accent">{founder.role}</p>
        {detailed ? (
          <div className="mt-4 space-y-3 text-muted">
            {founder.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-muted">{founder.summary}</p>
        )}
        {detailed && founder.expertise.length > 0 && (
          <dl className="mt-5 grid gap-3 text-sm">
            <div>
              <dt className="type-label">Focus</dt>
              <dd className="mt-1">{founder.expertise.join(", ")}</dd>
            </div>
            {founder.education && founder.education.length > 0 && (
              <div>
                <dt className="type-label">Education</dt>
                <dd className="mt-1">{founder.education.join("; ")}</dd>
              </div>
            )}
          </dl>
        )}
        {links.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {links.map((k) => (
              <li key={k}>
                <a href={founder.links[k]} target="_blank" rel="noopener noreferrer" className="link">
                  {linkLabels[k]}
                  <span className="sr-only"> profile of {founder.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <PreviewBadge label={label} className="mt-4" />
      </div>
    </article>
  );
}
