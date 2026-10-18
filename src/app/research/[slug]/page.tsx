import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { pageMetadata } from "@/lib/metadata";
import { getArticle, getArticles, getFoundersBySlugs, previewLabel } from "@/lib/content";
import { getArticleSourceStats } from "@/lib/article-source";
import { formatDate } from "@/lib/utilities";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PreviewBadge } from "@/components/ui/Badge";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/research/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    noIndex: previewLabel(article.governance) !== null,
  });
}

export default async function ArticlePage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { default: Body } = (await import(`@/content/research/${slug}.mdx`)) as { default: ComponentType };
  const { minutes, toc } = getArticleSourceStats(slug);
  const authors = getFoundersBySlugs(article.authors);
  const related = getArticles()
    .filter((a) => a.slug !== article.slug && a.topic === article.topic)
    .slice(0, 2);

  return (
    <article className="pb-[var(--space-section)]">
      <header className="container-site pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: article.title },
          ]}
        />
        <div className="mt-12 sm:mt-16 lg:grid lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <div className="lg:col-span-9 lg:col-start-4">
            <p className="text-sm text-accent">{article.topic}</p>
            <h1 className="type-h1 mt-4 max-w-[22ch]">{article.title}</h1>
            <p className="type-lead measure mt-6">{article.excerpt}</p>
            <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              {authors.length > 0 && <span>By {authors.map((a) => a.name).join(", ")}</span>}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              {article.updatedAt && (
                <span>
                  Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </span>
              )}
              <span>{minutes} min read</span>
            </p>
            <PreviewBadge label={previewLabel(article.governance)} className="mt-5" />
          </div>
        </div>
      </header>

      <div className="container-site mt-14">
        <div className="border-t border-line pt-12 lg:grid lg:grid-cols-12 lg:gap-[var(--gutter)]">
          {toc.length >= 3 && (
            <nav aria-label="On this page" className="mb-12 lg:col-span-3 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <p className="type-label">On this page</p>
                <ol className="mt-4 space-y-2 border-l border-line text-sm">
                  {toc.map((item) => (
                    <li key={item.id} className={item.depth === 3 ? "pl-7" : "pl-4"}>
                      <a href={`#${item.id}`} className="text-muted hover:text-fg">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          )}

          <div className="lg:col-span-8 lg:col-start-4">
            <div className="prose-site">
              <Body />
            </div>

            {article.references.length > 0 && (
              <section aria-labelledby="references-title" className="measure mt-16 border-t border-line pt-8">
                <h2 id="references-title" className="type-h3">
                  References
                </h2>
                <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-muted marker:text-subtle">
                  {article.references.map((r) => (
                    <li key={r.label}>
                      {r.label}{" "}
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="link break-all">
                          {r.url}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {related.length > 0 && (
              <section aria-labelledby="related-title" className="mt-16 border-t border-line pt-8">
                <h2 id="related-title" className="type-h3">
                  Related
                </h2>
                <ul className="mt-4 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/research/${r.slug}`} className="link">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
