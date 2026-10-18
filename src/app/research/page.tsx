import { pageMetadata } from "@/lib/metadata";
import { getArticles } from "@/lib/content";
import { PageIntro } from "@/components/sections/PageIntro";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Research",
  description: "Explorations, technical notes, and perspectives — published after review.",
  path: "/research",
});

export default function ResearchPage() {
  const articles = getArticles();
  const topics = [...new Set(articles.map((a) => a.topic))];
  return (
    <>
      <PageIntro
        label="Research"
        title="Thinking, written down."
        intro="Explorations, technical notes, and perspectives. Every piece is reviewed before it's published, and every reference points to something we've read."
        crumbs={[{ label: "Research" }]}
      >
        {topics.length > 1 && <p className="mt-6 text-sm text-subtle">Topics: {topics.join(", ")}</p>}
      </PageIntro>
      <div className="container-site pb-[var(--space-section)]">
        {articles.length === 0 ? (
          <EmptyState
            title="Nothing has been published yet."
            action={
              <ButtonLink href="/contact" variant="secondary">
                Suggest a topic
              </ButtonLink>
            }
          >
            We publish only after review, and we&rsquo;d rather wait than fill this page. The first pieces are
            in progress.
          </EmptyState>
        ) : (
          <div className="border-b border-line">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} headingLevel={2} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
