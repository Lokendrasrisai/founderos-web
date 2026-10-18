import type { Founder } from "@/types/content";
import { teamCopy } from "@/content/copy";
import { SectionContainer, SectionHeading } from "@/components/ui/Section";
import { FounderCard } from "@/components/cards/FounderCard";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Team: founder profiles, dynamically for any count. With no approved profiles it says so — it never
 * shows invented people.
 */
export function Team({
  founders,
  id = "team",
  detailed = false,
  showEmptyState = true,
}: {
  founders: Founder[];
  id?: string;
  detailed?: boolean;
  showEmptyState?: boolean;
}) {
  if (founders.length === 0 && !showEmptyState) return null;
  return (
    <SectionContainer id={id} labelledBy={`${id}-title`}>
      <SectionHeading
        id={`${id}-title`}
        label={teamCopy.label}
        title={teamCopy.headline}
        intro={founders.length > 0 ? teamCopy.intro : `${teamCopy.intro} ${teamCopy.pendingNote}`}
      />
      <div className="mt-14">
        {founders.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {founders.map((f) => (
              <FounderCard key={f.slug} founder={f} detailed={detailed} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Profiles are being written by the founders themselves."
            headingLevel={3}
            action={
              <ButtonLink href="/contact" variant="secondary">
                Contact the team
              </ButtonLink>
            }
          >
            We&rsquo;d rather show no profiles than placeholder ones. Each founder&rsquo;s profile will appear
            here once they have written it and approved it for publication.
          </EmptyState>
        )}
      </div>
    </SectionContainer>
  );
}
