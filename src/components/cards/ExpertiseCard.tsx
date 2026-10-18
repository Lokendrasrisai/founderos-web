import Link from "next/link";
import type { ExpertiseArea } from "@/types/content";
import { PreviewBadge } from "@/components/ui/Badge";
import { previewLabel } from "@/lib/content";

/**
 * ExpertiseCard: an index row, not a boxed card. Name and one-line summary, linking to the full entry.
 */
export function ExpertiseCard({ area }: { area: ExpertiseArea }) {
  const label = previewLabel(area.governance);
  return (
    <article className="group relative grid gap-2 border-t border-line py-6 md:grid-cols-2 md:gap-[var(--gutter)]">
      <h3 className="type-h3 flex items-start justify-between gap-4">
        <Link href={`/expertise#${area.slug}`} className="card-link">
          {area.name}
        </Link>
      </h3>
      <div>
        <p className="text-muted">{area.summary}</p>
        <PreviewBadge label={label} className="mt-3" />
      </div>
    </article>
  );
}
