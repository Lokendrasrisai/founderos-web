import type { ArticleMeta } from "@/types/content";

/**
 * Research article registry. The article body lives next to this file as `<slug>.mdx`.
 *
 * PRODUCTION articles go in `articles`. It is empty: nothing has been written and reviewed yet.
 * An article renders only after review: governance.approval = "approved", verification = "verified".
 * References must point to real, checkable sources. Never cite something you have not read.
 */
export const articles: ArticleMeta[] = [];

/** DEMO_ONLY fixtures. Rendered only when FOUNDEROS_DEMO_CONTENT=true outside production. */
export const demoArticles: ArticleMeta[] = [
  {
    slug: "demo-governed-content",
    title: "Keeping unverified claims off a founding-team website",
    topic: "Engineering practice",
    authors: ["demo-founder-a"],
    publishedAt: "2026-10-18",
    excerpt:
      "Sample article demonstrating long-form layout: how a small team can make truthfulness a property of the build, not a matter of memory.",
    references: [
      {
        label: "W3C. Web Content Accessibility Guidelines (WCAG) 2.2.",
        url: "https://www.w3.org/TR/WCAG22/",
      },
      {
        label: "web.dev. Web Vitals.",
        url: "https://web.dev/articles/vitals",
      },
      {
        label: "Next.js documentation. generateStaticParams.",
        url: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params",
      },
    ],
    governance: {
      owner: "design-fixture",
      verification: "placeholder",
      approval: "demo",
      lastReviewed: "2026-10-18",
      notes: "DEMO_ONLY. Layout fixture.",
    },
  },
];
