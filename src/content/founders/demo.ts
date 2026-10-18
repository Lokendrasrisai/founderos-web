import type { Founder } from "@/types/content";

/**
 * DEMO_ONLY — local design fixtures.
 * These are not real people. They render only when FOUNDEROS_DEMO_CONTENT=true outside production.
 */
const demo = {
  owner: "design-fixture",
  verification: "placeholder",
  approval: "demo",
  lastReviewed: "2026-10-18",
  notes: "DEMO_ONLY. Not a real person.",
} as const;

export const demoFounders: Founder[] = [
  {
    slug: "demo-founder-a",
    name: "Founder A",
    role: "Engineering & systems",
    summary: "Placeholder profile. Replace with a short, approved summary written by the founder.",
    bio: [
      "This is placeholder text showing where a founder's biography goes. A good biography says what the person has actually built, in plain language, and links to evidence.",
      "Keep it to two short paragraphs. Avoid superlatives and titles that imply a company already exists.",
    ],
    expertise: ["Distributed systems", "Developer tooling"],
    education: ["[Degree, institution — only if approved]"],
    links: {},
    order: 1,
    governance: demo,
  },
  {
    slug: "demo-founder-b",
    name: "Founder B",
    role: "Machine learning & data",
    summary: "Placeholder profile. Replace with a short, approved summary written by the founder.",
    bio: [
      "Placeholder biography. Describe the problems this founder has worked on and what they personally contributed.",
    ],
    expertise: ["Applied machine learning", "Data pipelines"],
    links: {},
    order: 2,
    governance: demo,
  },
  {
    slug: "demo-founder-c",
    name: "Founder C",
    role: "Product & strategy",
    summary: "Placeholder profile. Replace with a short, approved summary written by the founder.",
    bio: [
      "Placeholder biography. Describe experience with customers, markets, or product decisions — with specifics the founder is comfortable publishing.",
    ],
    expertise: ["Product discovery", "Business modelling"],
    links: {},
    order: 3,
    governance: demo,
  },
  {
    slug: "demo-founder-d",
    name: "Founder D",
    role: "Geospatial & infrastructure",
    summary: "Placeholder profile. Replace with a short, approved summary written by the founder.",
    bio: [
      "Placeholder biography. Name real tools and real systems; leave out anything that belongs to an employer without permission.",
    ],
    expertise: ["Geospatial data", "Cloud infrastructure"],
    links: {},
    order: 4,
    governance: demo,
  },
];
