import { philosophyCopy, principles } from "@/content/copy";
import { SectionContainer } from "@/components/ui/Section";

/** Philosophy: one strong statement, then three principles set as editorial type — no boxes. */
export function Philosophy() {
  return (
    <SectionContainer id="philosophy" labelledBy="philosophy-title">
      <div className="grid-editorial">
        <p className="type-label pt-2">{philosophyCopy.label}</p>
        <div>
          <h2 id="philosophy-title" className="type-h1 max-w-[18ch]">
            {philosophyCopy.headline}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-[var(--gutter)]">
            {philosophyCopy.body.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? "text-lg leading-relaxed text-fg" : "text-lg leading-relaxed text-muted"}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-editorial mt-[var(--space-block)]">
        <h3 className="type-label pt-1">Principles</h3>
        <ul className="divide-y divide-line border-y border-line">
          {principles.map((p) => (
            <li key={p.title} className="grid gap-3 py-8 md:grid-cols-2 md:gap-[var(--gutter)]">
              <p className="text-[clamp(1.5rem,1.2rem+1.3vw,2.25rem)] leading-tight font-medium tracking-[-0.03em]">
                {p.title}
              </p>
              <p className="text-muted md:pt-2">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
