import { pageMetadata } from "@/lib/metadata";
import {
  getArticles,
  getExpertise,
  getFeaturedProjects,
  getFounders,
  getProjects,
  getSectionAvailability,
} from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { ExpertiseIndex } from "@/components/sections/ExpertiseIndex";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Team } from "@/components/sections/Team";
import { Approach } from "@/components/sections/Approach";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export const metadata = pageMetadata({ path: "/" });

/**
 * Homepage narrative: who we are → how we think → what we know → what we've shown → who we are as
 * people → how we work → what we're writing → an invitation. Sections without real content are omitted.
 */
export default function HomePage() {
  const available = getSectionAvailability();
  const projects = getProjects();
  const articles = getArticles();

  const primary = available.work
    ? { label: "Explore our work", href: "/work" }
    : { label: "Read our principles", href: "#philosophy" };
  const secondary = available.team
    ? { label: "Meet the team", href: "#team" }
    : { label: "Start a conversation", href: "/contact" };

  return (
    <>
      <Hero primary={primary} secondary={secondary} />
      <Philosophy />
      <ExpertiseIndex areas={getExpertise()} />
      <SelectedWork projects={getFeaturedProjects(3)} total={projects.length} />
      <Team founders={getFounders()} showEmptyState={false} />
      <Approach />
      <ResearchSection articles={articles.slice(0, 3)} total={articles.length} />
      <ClosingCta />
    </>
  );
}
