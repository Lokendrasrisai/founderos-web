import { closingCopy } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";

/** Closing CTA: calm, typographic, one action. */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="section-y">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <ClosingGrid />
          <h2 id="closing-title" className="type-h1 relative max-w-[20ch]">
            {closingCopy.headline}
          </h2>
          <p className="type-lead relative mt-6 max-w-[52ch]">{closingCopy.body}</p>
          <ButtonLink href={closingCopy.cta.href} size="lg" className="relative mt-10">
            {closingCopy.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Faint registration grid echoing the hero, fading toward the text. */
function ClosingGrid() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 md:block"
      preserveAspectRatio="none"
      viewBox="0 0 400 400"
    >
      <defs>
        <linearGradient id="closing-fade" x1="0" x2="1">
          <stop offset="0" stopColor="var(--color-steel)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-steel)" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <g stroke="url(#closing-fade)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} x2={i * 40} y1="0" y2="400" vectorEffect="non-scaling-stroke" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1="0" x2="400" y1={i * 40} y2={i * 40} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
