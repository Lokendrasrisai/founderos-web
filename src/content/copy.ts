/**
 * Editorial copy for pages. This is the team's own voice — it describes intent and method,
 * not achievements. Keep factual claims (projects, people, results) in their own governed records.
 */
import type { Principle, ProcessStage } from "@/types/content";

export const heroCopy = {
  status: "A founding team in the exploration stage",
  headline: ["Built to question.", "Driven to create."] as const,
  body: "We are an emerging team of technologists and builders exploring complex problems at the intersection of software, intelligence, and real-world systems.",
  primaryCta: { label: "Explore our work", href: "/work" },
  secondaryCta: { label: "Meet the team", href: "/about#team" },
};

export const philosophyCopy = {
  label: "Philosophy",
  headline: "Technology is the medium. Impact is the objective.",
  body: [
    "We don't start from a technology looking for a use. We start from a problem, and earn the right to build by understanding it first — the people who have it, the systems around it, and the economics that decide whether a solution survives.",
    "Curiosity sets the direction. Research narrows it. Engineering makes it real. Commercial reasoning keeps it honest.",
  ],
};

export const principles: Principle[] = [
  {
    title: "Understand deeply.",
    body: "Spend time with the problem before the solution. Read the literature, talk to the people affected, and write down what we don't know.",
  },
  {
    title: "Build deliberately.",
    body: "Choose the simplest architecture that can carry the next year of change. Prefer boring infrastructure, clear interfaces, and code a newcomer can read.",
  },
  {
    title: "Validate relentlessly.",
    body: "Treat every assumption as a hypothesis. Measure against real usage, publish what we learn, and change course when the evidence says so.",
  },
];

export const processStages: ProcessStage[] = [
  {
    id: "discovery",
    name: "Discovery",
    description:
      "Frame the problem in the words of the people who have it. Separate what is known from what is assumed.",
    output: "A one-page problem statement and a list of open questions.",
    example: "Interview notes, a map of the current workflow, the cost of doing nothing.",
  },
  {
    id: "research",
    name: "Research",
    description:
      "Study prior work, existing tools, and constraints — technical, regulatory, and economic — before proposing anything.",
    output: "A short landscape review with sources, and the riskiest assumption named.",
    example: "Literature notes, competitor teardown, data availability check.",
  },
  {
    id: "design",
    name: "Design",
    description:
      "Sketch the smallest system that could test the riskiest assumption. Decide what we will not build.",
    output: "Architecture sketch, interface contracts, and explicit success criteria.",
  },
  {
    id: "build",
    name: "Build",
    description:
      "Implement in thin, working slices. Instrument from day one so the next stage has evidence to work with.",
    output: "A working slice in real hands, with tests and observability.",
  },
  {
    id: "validate",
    name: "Validate",
    description:
      "Compare results against the success criteria we wrote down before building — not the ones we wish we had.",
    output: "A written result: what held, what broke, and what it cost.",
  },
  {
    id: "improve",
    name: "Improve",
    description:
      "Decide to deepen, redirect, or stop. Fold what we learned back into the next discovery cycle.",
    output: "A decision record and an updated problem statement.",
  },
];

export const approachCopy = {
  label: "Approach",
  headline: "How we intend to work.",
  intro:
    "A loop, not a pipeline. This is the method we hold ourselves to on every exploration — written down so we can be held to it.",
};

export const teamCopy = {
  label: "People",
  headline: "Different disciplines. Shared ambition.",
  intro: "Our backgrounds span technology, engineering, business, and product development.",
  pendingNote: "Profiles appear here once each founder has written and approved their own.",
};

export const closingCopy = {
  headline: "The next meaningful breakthrough starts with a problem worth solving.",
  body: "We're always interested in thoughtful conversations about difficult problems, emerging technology, and ambitious ideas.",
  cta: { label: "Start a conversation", href: "/contact" },
};

export const aboutCopy = {
  intro: {
    label: "About",
    headline: "A founding team, in the open.",
    body: "We are four or more people with backgrounds across technology, engineering, business, and product development, exploring how to build a durable, highly scalable technology company in the United States. We haven't chosen the industry or the product yet. This site is where we show our thinking while we do.",
  },
  motivation: {
    label: "Why we're doing this",
    headline: "Patient with problems. Impatient with excuses.",
    paragraphs: [
      "Each of us has seen good technology fail because it solved the wrong problem, and important problems go unsolved because no one was patient enough to understand them. We want to work the other way around.",
      "Rather than commit early to an idea and defend it, we are deliberately exploring several problem spaces, building small things, and letting evidence decide where we go deep.",
    ],
  },
  /**
   * The ledger separates fact from intent. "Done" and "Demonstrable" are populated from governed
   * records only; "Exploring" and "Aspire" are clearly labelled as intent.
   */
  aspirations: [
    "Build one product that a specific group of people would be genuinely upset to lose.",
    "Grow into a company known for engineering quality and for telling the truth about its results.",
    "Publish what we learn, including what didn't work.",
  ],
  exploring: [
    "Where software and machine intelligence can remove real friction from physical-world operations.",
    "Which problems are worth a decade of work — and which only look that way.",
  ],
};

export const joinCopy = {
  label: "Join",
  headline: "Collaboration, honestly framed.",
  body: "We are not hiring, and we have no open roles. We are interested in hearing from people who want to collaborate on research, share a hard problem from their own work, or simply compare notes on building something durable.",
  interests: [
    {
      title: "Research collaboration",
      body: "If you're working on a problem adjacent to our areas of interest and want a second set of hands or eyes.",
    },
    {
      title: "Problems from the field",
      body: "If you live with an operational problem that software should have solved by now, we'd like to understand it.",
    },
    {
      title: "Future team interest",
      body: "If you'd want to hear from us when we do start building a team, introduce yourself. We'll be candid about timing.",
    },
  ],
  note: "There is no application process and nothing to apply for yet. Any note you send is a conversation, not a candidacy.",
};
