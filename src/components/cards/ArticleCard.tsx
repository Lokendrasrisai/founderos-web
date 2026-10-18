import Link from "next/link";
import type { ArticleMeta } from "@/types/content";
import { PreviewBadge } from "@/components/ui/Badge";
import { getFoundersBySlugs, previewLabel } from "@/lib/content";
import { getArticleSourceStats } from "@/lib/article-source";
import { formatDate } from "@/lib/utilities";

/** ArticleCard: date, topic, title, excerpt, author(s), reading time. */
export function ArticleCard({ article, headingLevel = 3 }: { article: ArticleMeta; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const authors = getFoundersBySlugs(article.authors).map((f) => f.name);
  const { minutes } = getArticleSourceStats(article.slug);
  const label = previewLabel(article.governance);
  return (
    <article className="group relative grid-editorial border-t border-line py-8">
      <div>
        <p className="type-meta">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, "short")}</time>
        </p>
        <p className="mt-1 text-sm text-muted">{article.topic}</p>
      </div>
      <div>
        <H className="type-h3 max-w-[34ch]">
          <Link href={`/research/${article.slug}`} className="card-link">
            {article.title}
          </Link>
        </H>
        <p className="measure mt-3 text-muted">{article.excerpt}</p>
        <p className="mt-4 text-sm text-subtle">
          {authors.length > 0 && <span>{authors.join(", ")}</span>}
          {authors.length > 0 && <span aria-hidden> / </span>}
          <span>{minutes} min read</span>
        </p>
        <PreviewBadge label={label} className="mt-3" />
      </div>
    </article>
  );
}
