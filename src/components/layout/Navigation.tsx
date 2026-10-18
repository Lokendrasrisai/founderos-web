import Link from "next/link";
import { getPrimaryNav, primaryAction } from "@/config/navigation";
import { site } from "@/config/site";
import { Monogram } from "@/components/ui/Monogram";
import { ButtonLink } from "@/components/ui/Button";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/** Navigation: sticky site header. Sections without publishable content are omitted. */
export function Navigation() {
  const items = getPrimaryNav();
  return (
    <header className="site-header sticky top-0 z-40 border-b border-line">
      <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link href="/" className="-ml-1 flex items-center gap-2.5 rounded-[var(--radius-sm)] p-1 text-fg">
          <Monogram className="size-7" />
          <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{site.name}</span>
          <span className="sr-only">, home</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks items={items} />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <ButtonLink href={primaryAction.href} size="md">
            {primaryAction.label}
          </ButtonLink>
        </div>

        <div className="flex items-center lg:hidden">
          <MobileNavigation items={items} action={primaryAction} />
        </div>
      </div>
    </header>
  );
}
