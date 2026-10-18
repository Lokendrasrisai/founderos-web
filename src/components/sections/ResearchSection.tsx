import type { ArticleMeta } from "@/types/content";
import { SectionContainer, SectionHeading } from "@/components/ui/Section";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";

/** Research & perspectives. Removed from the homepage entirely until a reviewed article exists. */
export function ResearchSection({ articles, total }: { articles: ArticleMeta[]; total: number }) {
  if (articles.length === 0) return null;
  return (
    <SectionContainer id="research" labelledBy="research-title">
      <SectionHeading
        id="research-title"
        label="Research"
        title="Thinking, written down."
        intro="Explorations and technical notes, published after review."
      />
      <div className="mt-12 border-b border-line">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
      {total > articles.length && (
        <ButtonLink href="/research" variant="secondary" className="mt-10">
          All writing
        </ButtonLink>
      )}
    </SectionContainer>
  );
}
