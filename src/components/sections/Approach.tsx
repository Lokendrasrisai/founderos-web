import { approachCopy, processStages } from "@/content/copy";
import { SectionContainer, SectionHeading } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { ProcessExplorer } from "@/components/sections/ProcessExplorer";

/**
 * Approach: the six-stage loop. Small screens get the whole sequence as a readable timeline;
 * larger screens get the interactive explorer. Both carry the same content.
 */
export function Approach() {
  return (
    <SectionContainer id="approach" labelledBy="approach-title">
      <SectionHeading
        id="approach-title"
        label={approachCopy.label}
        title={approachCopy.headline}
        intro={approachCopy.intro}
      />
      <div className="mt-14">
        <div className="md:hidden">
          <Timeline
            items={processStages.map((s) => ({
              id: s.id,
              title: s.name,
              body: (
                <>
                  <p>{s.description}</p>
                  <p className="mt-3 text-sm text-fg">
                    <span className="text-muted">Output: </span>
                    {s.output}
                  </p>
                </>
              ),
            }))}
          />
          <p className="mt-6 pl-[3.25rem] text-sm text-subtle">After Improve, the loop begins again.</p>
        </div>
        <div className="hidden md:block">
          <ProcessExplorer stages={processStages} />
        </div>
      </div>
    </SectionContainer>
  );
}
