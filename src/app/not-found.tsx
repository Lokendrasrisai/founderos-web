import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-site flex flex-col justify-center py-[var(--space-section)]">
      <div className="grid-editorial">
        <p className="type-meta pt-3">404</p>
        <div>
          <h1 className="type-h1 max-w-[16ch]">This page isn&rsquo;t here.</h1>
          <p className="type-lead measure mt-6">
            It may have moved, or it was never published. Some sections of this site only appear once their
            content has been verified.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg">
              Go to the homepage
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Contact the team
            </ButtonLink>
          </div>
          <p className="mt-10 text-sm text-subtle">
            Looking for something specific? Try{" "}
            <Link href="/about" className="link">
              About
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
