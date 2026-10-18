import { heroCopy } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";
import { HeroGraphic } from "@/components/visuals/HeroGraphic";

interface HeroAction {
  label: string;
  href: string;
}

/**
 * Hero: the headline and the one orchestrated visual moment of the site.
 * CTAs are passed in so they only point at sections that have real content.
 */
export function Hero({ primary, secondary }: { primary: HeroAction; secondary: HeroAction }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-site grid items-center gap-y-10 pt-[clamp(3.5rem,2rem+6vw,7.5rem)] pb-[clamp(3.5rem,2rem+5vw,6.5rem)] lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="lg:col-span-7">
          <p className="anim-fade flex items-center gap-2.5 text-sm text-muted">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-accent opacity-40" />
              <span className="relative m-[2px] size-1 rounded-full bg-accent" />
            </span>
            {heroCopy.status}
          </p>

          <h1 id="hero-title" className="type-display mt-7">
            <span className="anim-settle block" style={{ ["--delay" as string]: "60ms" }}>
              {heroCopy.headline[0]}
            </span>
            <span className="anim-settle block" style={{ ["--delay" as string]: "160ms" }}>
              {heroCopy.headline[1]}
            </span>
          </h1>

          <p className="anim-rise type-lead mt-8 max-w-[46ch]" style={{ ["--delay" as string]: "280ms" }}>
            {heroCopy.body}
          </p>

          <div className="anim-rise mt-10 flex flex-wrap gap-3" style={{ ["--delay" as string]: "360ms" }}>
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="secondary">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroGraphic className="mx-auto h-auto w-full max-w-[480px] lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
