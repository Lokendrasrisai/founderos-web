import type { Project } from "@/types/content";

/**
 * DEMO_ONLY — local design fixtures. These projects do not exist.
 * They render only when FOUNDEROS_DEMO_CONTENT=true outside production.
 */
const demo = {
  owner: "design-fixture",
  verification: "placeholder",
  approval: "demo",
  lastReviewed: "2026-10-18",
  notes: "DEMO_ONLY. Invented example used to test layout.",
} as const;

export const demoProjects: Project[] = [
  {
    slug: "demo-offline-field-sync",
    title: "Offline-first field data sync",
    category: "Data systems",
    disciplines: ["software-engineering", "data-systems"],
    type: "prototype",
    year: 2026,
    summary:
      "Sample case study: a sync layer for crews who collect data where connectivity is intermittent, designed so no record is ever silently lost.",
    role: "Placeholder — state exactly which founder did what.",
    technologies: ["TypeScript", "SQLite", "CRDTs", "PostgreSQL"],
    outcome: "[Verified outcome — a measured result and how it was measured]",
    cover: {
      kind: "generated",
      variant: "lattice",
      seed: 17,
      alt: "Abstract lattice of connected squares, some offset, suggesting records reconciling into a grid.",
    },
    links: {},
    contributors: ["demo-founder-a", "demo-founder-d"],
    permission: "own-work",
    featured: true,
    caseStudy: {
      context: [
        "Placeholder. Describe who had the problem and the environment they work in. Keep it factual and specific.",
      ],
      problem: ["Placeholder. State the problem as the users experienced it, and what it cost them."],
      approach: [
        "Placeholder. Explain the options considered and why one was chosen. Mention what was deliberately left out.",
      ],
      architecture: [
        "Placeholder. A short description of the main components and how data moves between them. Pair it with a diagram in the evidence section.",
      ],
      implementation: [
        "Placeholder. Note the hard parts and how they were solved. Link to source if it is public.",
      ],
      verification: [
        "Placeholder. How was correctness checked? Tests, field trials, review — name the method.",
      ],
      outcomes: ["Placeholder. Only measured, verified outcomes. If there are none yet, say so."],
      lessons: ["Placeholder. What would you do differently?"],
    },
    governance: demo,
  },
  {
    slug: "demo-geospatial-change-detection",
    title: "Geospatial change detection pipeline",
    category: "Geospatial",
    disciplines: ["geospatial-systems", "ai-automation"],
    type: "research",
    year: 2025,
    summary:
      "Sample case study: comparing satellite imagery over time to flag meaningful land-use change while keeping false alarms reviewable.",
    role: "Placeholder — state exactly which founder did what.",
    technologies: ["Python", "PyTorch", "GDAL", "PostGIS"],
    cover: {
      kind: "generated",
      variant: "contour",
      seed: 42,
      alt: "Abstract topographic contour lines with one highlighted region, suggesting detected change on a map.",
    },
    links: {},
    contributors: ["demo-founder-b", "demo-founder-d"],
    permission: "own-work",
    featured: true,
    caseStudy: {
      context: ["Placeholder context paragraph."],
      problem: ["Placeholder problem paragraph."],
      approach: ["Placeholder approach paragraph."],
      architecture: ["Placeholder architecture paragraph."],
      implementation: ["Placeholder implementation paragraph."],
      verification: ["Placeholder verification paragraph."],
      outcomes: ["No verified outcome recorded. This is how an honest empty outcome reads."],
      lessons: ["Placeholder lessons paragraph."],
    },
    governance: demo,
  },
  {
    slug: "demo-extraction-eval-harness",
    title: "Evaluation harness for document extraction",
    category: "Machine learning",
    disciplines: ["ai-automation", "software-engineering"],
    type: "open-source",
    year: 2025,
    summary:
      "Sample case study: a small, reproducible harness for scoring document-extraction models against labelled examples before trusting them in a workflow.",
    role: "Placeholder — state exactly which founder did what.",
    technologies: ["Python", "Pydantic", "DuckDB"],
    cover: {
      kind: "generated",
      variant: "signal",
      seed: 7,
      alt: "Abstract set of horizontal signal traces with one converging line, suggesting measurements against a baseline.",
    },
    links: {},
    contributors: ["demo-founder-b", "demo-founder-c"],
    permission: "own-work",
    caseStudy: {
      context: ["Placeholder context paragraph."],
      problem: ["Placeholder problem paragraph."],
      approach: ["Placeholder approach paragraph."],
      architecture: ["Placeholder architecture paragraph."],
      implementation: ["Placeholder implementation paragraph."],
      verification: ["Placeholder verification paragraph."],
      outcomes: ["Placeholder outcomes paragraph."],
      lessons: ["Placeholder lessons paragraph."],
    },
    governance: demo,
  },
];
