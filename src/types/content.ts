/**
 * Content model. Every public claim is a record with a governance block.
 * Only records that pass `isPublishable` (src/lib/content.ts) render publicly.
 */

export type VerificationStatus =
  /** Facts checked against evidence by the content owner. */
  | "verified"
  /** Written but not yet checked. Never rendered publicly. */
  | "unverified"
  /** Editorial placeholder text. Never rendered publicly. */
  | "placeholder";

export type ApprovalStatus =
  /** Approved for publication by the people it describes. */
  | "approved"
  /** Work in progress. Never rendered publicly. */
  | "draft"
  /** Local design fixture. Only renders when demo mode is on outside production. */
  | "demo";

export interface Governance {
  /** Who is accountable for this record (a founder slug or a name). */
  owner: string;
  verification: VerificationStatus;
  approval: ApprovalStatus;
  /** ISO date, YYYY-MM-DD. */
  lastReviewed: string;
  /** Optional reviewer notes. Never rendered. */
  notes?: string;
}

export interface ImageAsset {
  /** Path under /public, e.g. "/images/founders/jane.jpg". */
  src: string;
  /** Descriptive alt text. Required. */
  alt: string;
  width: number;
  height: number;
}

export interface ExternalLinks {
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Founder {
  slug: string;
  name: string;
  /** Public role description, e.g. "Engineering & infrastructure". Not a legal title. */
  role: string;
  /** One-sentence summary used on cards. */
  summary: string;
  /** Full biography, one string per paragraph. */
  bio: string[];
  expertise: string[];
  /** Only include if the founder approved publishing it. */
  education?: string[];
  photo?: ImageAsset;
  links: ExternalLinks;
  /** Display order (ascending). */
  order: number;
  governance: Governance;
}

export type ProjectType = "product" | "research" | "open-source" | "prototype" | "infrastructure";

/** Ownership / permission to publish. Employer or collaborator work needs explicit permission. */
export type PublishPermission = "own-work" | "permission-granted" | "permission-pending";

export interface CaseStudy {
  context: string[];
  problem: string[];
  approach: string[];
  architecture: string[];
  implementation: string[];
  verification: string[];
  outcomes: string[];
  lessons: string[];
}

export interface CoverArtwork {
  /** Generated, original artwork variant. */
  kind: "generated";
  variant: "contour" | "lattice" | "signal" | "graph";
  /** Deterministic seed so the artwork is stable between builds. */
  seed: number;
  /** Describe what the artwork represents, for alt text. */
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Expertise slugs this project demonstrates. Used for filtering. */
  disciplines: string[];
  type: ProjectType;
  year: number;
  summary: string;
  /** What the team (or which founder) actually did. */
  role: string;
  technologies: string[];
  /** A verified, specific outcome. Omit rather than guess. */
  outcome?: string;
  cover: CoverArtwork | (ImageAsset & { kind: "image" });
  /** Optional evidence images (screenshots, diagrams). */
  evidence?: ImageAsset[];
  links: {
    source?: string;
    demo?: string;
    writeup?: string;
  };
  /** Founder slugs. */
  contributors: string[];
  permission: PublishPermission;
  featured?: boolean;
  caseStudy: CaseStudy;
  governance: Governance;
}

export interface ExpertiseArea {
  slug: string;
  name: string;
  /** Short line for the homepage index. */
  summary: string;
  overview: string;
  technologies: string[];
  problemsUnderstood: string[];
  /** Concrete, verifiable experience. Leave empty rather than inflate. */
  relevantExperience: string[];
  /** Project slugs. Only published projects are shown. */
  exampleProjects: string[];
  researchDirections: string[];
  order: number;
  governance: Governance;
}

export interface Reference {
  /** Full citation text. Must point to a real, checkable source. */
  label: string;
  url?: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  topic: string;
  /** Founder slugs. */
  authors: string[];
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  references: Reference[];
  governance: Governance;
}

export interface ProcessStage {
  id: string;
  name: string;
  description: string;
  output: string;
  example?: string;
}

export interface Principle {
  title: string;
  body: string;
}
