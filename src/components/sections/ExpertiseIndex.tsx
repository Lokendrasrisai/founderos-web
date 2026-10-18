import type { ExpertiseArea } from "@/types/content";
import { SectionContainer, SectionHeading } from "@/components/ui/Section";
import { ExpertiseCard } from "@/components/cards/ExpertiseCard";
import { ButtonLink } from "@/components/ui/Button";

export function ExpertiseIndex({ areas }: { areas: ExpertiseArea[] }) {
  if (areas.length === 0) return null;
  return (
    <SectionContainer id="expertise" labelledBy="expertise-title">
      <SectionHeading
        id="expertise-title"
        label="Expertise"
        title="Where our experience runs deep."
        intro="The disciplines the team can speak to from first-hand work. Each links to the problems we understand and what we've built."
      />
      <div className="grid-editorial mt-12">
        <div aria-hidden className="hidden md:block" />
        <div>
          <div className="border-b border-line">
            {areas.map((a) => (
              <ExpertiseCard key={a.slug} area={a} />
            ))}
          </div>
          <ButtonLink href="/expertise" variant="secondary" className="mt-8">
            All capabilities in detail
          </ButtonLink>
        </div>
      </div>
    </SectionContainer>
  );
}
