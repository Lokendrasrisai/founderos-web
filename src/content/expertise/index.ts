import type { ExpertiseArea } from "@/types/content";

/**
 * Areas of expertise.
 *
 * These six areas come from the project brief as *suggestions*. They are recorded as unverified drafts
 * and are hidden publicly until a founder confirms each one is backed by real team experience:
 *   1. fill in `relevantExperience` with concrete, checkable statements,
 *   2. trim `technologies` to what the team has genuinely used in depth,
 *   3. set governance.verification = "verified" and governance.approval = "approved".
 * Delete any area the team cannot support.
 */
const draft = (owner = "unassigned") =>
  ({
    owner,
    verification: "unverified",
    approval: "draft",
    lastReviewed: "2026-10-18",
    notes: "Suggested in the brief. Needs founder confirmation.",
  }) as const;

export const expertise: ExpertiseArea[] = [
  {
    slug: "ai-automation",
    name: "Artificial intelligence & automation",
    summary: "Applied machine learning where it measurably beats the simpler alternative.",
    overview:
      "Using machine learning and language models as components inside larger systems — evaluated against plain baselines, monitored in use, and replaced when something simpler works.",
    technologies: ["Python", "PyTorch", "LLM APIs", "Evaluation tooling"],
    problemsUnderstood: [
      "Deciding when a model is the right tool and when rules or search are enough.",
      "Building evaluation sets that reflect real inputs, not convenient ones.",
      "Keeping humans in the loop where errors are expensive.",
    ],
    relevantExperience: [],
    exampleProjects: ["demo-geospatial-change-detection", "demo-extraction-eval-harness"],
    researchDirections: [
      "Reliable extraction from messy operational documents.",
      "Cost-aware model routing.",
    ],
    order: 1,
    governance: draft(),
  },
  {
    slug: "software-engineering",
    name: "Software engineering",
    summary: "Maintainable systems with clear interfaces and honest tests.",
    overview:
      "Designing and building production software: typed interfaces, sensible boundaries, automated testing, and code that stays legible as the team grows.",
    technologies: ["TypeScript", "Python", "Go", "React"],
    problemsUnderstood: [
      "Trading delivery speed against long-term maintainability, explicitly.",
      "Designing APIs other teams can depend on.",
    ],
    relevantExperience: [],
    exampleProjects: ["demo-offline-field-sync", "demo-extraction-eval-harness"],
    researchDirections: ["Local-first software for unreliable networks."],
    order: 2,
    governance: draft(),
  },
  {
    slug: "data-systems",
    name: "Data systems & analytics",
    summary: "Pipelines and models of data that people can trust and question.",
    overview:
      "Collecting, modelling, and serving data so that the numbers people make decisions with are traceable back to their source.",
    technologies: ["PostgreSQL", "DuckDB", "dbt", "Event streaming"],
    problemsUnderstood: [
      "Data quality failures that only show up downstream.",
      "Schema evolution without breaking consumers.",
    ],
    relevantExperience: [],
    exampleProjects: ["demo-offline-field-sync"],
    researchDirections: ["Lineage and provenance for small teams."],
    order: 3,
    governance: draft(),
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud infrastructure",
    summary: "Infrastructure that is cheap to run and dull to operate.",
    overview:
      "Provisioning, deploying, and observing services with infrastructure-as-code, keeping cost and operational load proportional to the stage of the work.",
    technologies: ["AWS", "Terraform", "Containers", "Observability tooling"],
    problemsUnderstood: [
      "Avoiding premature complexity in early-stage systems.",
      "Making failures visible before users report them.",
    ],
    relevantExperience: [],
    exampleProjects: [],
    researchDirections: [],
    order: 4,
    governance: draft(),
  },
  {
    slug: "geospatial-systems",
    name: "Geospatial systems",
    summary: "Location data, imagery, and maps as first-class engineering inputs.",
    overview:
      "Working with vector and raster data, coordinate systems, and spatial queries to answer questions about where things are and how they change.",
    technologies: ["PostGIS", "GDAL", "Raster processing", "Web mapping"],
    problemsUnderstood: [
      "Projection and resolution mismatches that quietly corrupt analysis.",
      "Making spatial results reviewable by non-specialists.",
    ],
    relevantExperience: [],
    exampleProjects: ["demo-geospatial-change-detection"],
    researchDirections: ["Change detection with reviewable confidence."],
    order: 5,
    governance: draft(),
  },
  {
    slug: "product-strategy",
    name: "Product & business strategy",
    summary: "Deciding what is worth building, and for whom.",
    overview:
      "Customer discovery, problem framing, and the business reasoning that decides whether a technically sound idea can become a durable company.",
    technologies: ["Customer interviews", "Market sizing", "Pricing experiments"],
    problemsUnderstood: [
      "Distinguishing a painful problem from an interesting one.",
      "Sequencing a product so each stage funds the next.",
    ],
    relevantExperience: [],
    exampleProjects: [],
    researchDirections: [],
    order: 6,
    governance: draft(),
  },
];
