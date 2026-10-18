import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

/** Opening block for inner pages: breadcrumbs, page name in the margin column, h1 and lead. */
export function PageIntro({
  label,
  title,
  intro,
  crumbs,
  children,
}: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="container-site pt-10 pb-[var(--space-block)] sm:pt-14">
      {crumbs && <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />}
      <div className="grid-editorial mt-12 sm:mt-16">
        <p className="type-label pt-2">{label}</p>
        <div>
          <h1 className="type-h1 max-w-[18ch]">{title}</h1>
          {intro && <div className="type-lead measure mt-6">{intro}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}
