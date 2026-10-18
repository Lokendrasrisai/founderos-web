import Link from "next/link";
import { getFooterNav } from "@/config/navigation";
import { copyrightHolder, entityStatement, site } from "@/config/site";
import { Monogram } from "@/components/ui/Monogram";

/** Footer: brand, mission, navigation, contact, and an accurate entity statement. */
export function Footer() {
  const nav = getFooterNav();
  const year = new Date().getUTCFullYear(); // evaluated at build time; pages are static
  return (
    <footer className="mt-auto border-t border-line">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:gap-[var(--gutter)]">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <Monogram className="size-7" />
            <span className="font-medium">{site.name}</span>
          </div>
          <p className="mt-5 max-w-[42ch] text-muted">{site.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <h2 className="type-label">Site</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-sm text-muted hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="type-label">Contact</h2>
          <ul className="mt-4 space-y-2.5">
            {site.contact.email ? (
              <li>
                <a href={`mailto:${site.contact.email}`} className="link break-all">
                  {site.contact.email}
                </a>
              </li>
            ) : (
              <li>
                <Link href="/contact" className="rounded-sm text-muted hover:text-fg">
                  Contact options
                </Link>
              </li>
            )}
            {site.social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-fg"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line py-6 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {copyrightHolder()}
        </p>
        <p>{entityStatement()}</p>
      </div>
    </footer>
  );
}
