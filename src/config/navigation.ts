import { getSectionAvailability, isPreviewMode } from "@/lib/content";

export interface NavItem {
  label: string;
  href: string;
}

type Section = "expertise" | "work" | "research";

const primary: Array<NavItem & { requires?: Section }> = [
  { label: "About", href: "/about" },
  { label: "Expertise", href: "/expertise", requires: "expertise" },
  { label: "Work", href: "/work", requires: "work" },
  { label: "Research", href: "/research", requires: "research" },
  { label: "Contact", href: "/contact" },
];

export const primaryAction: NavItem = { label: "Connect with us", href: "/contact" };

/** Primary navigation, omitting sections that have no publishable content yet. */
export function getPrimaryNav(preview = isPreviewMode()): NavItem[] {
  const available = getSectionAvailability(preview);
  return primary
    .filter((item) => !item.requires || available[item.requires])
    .map(({ label, href }) => ({ label, href }));
}

export function getFooterNav(preview = isPreviewMode()): NavItem[] {
  return [
    ...getPrimaryNav(preview),
    { label: "Join", href: "/join" },
    { label: "Privacy", href: "/privacy" },
  ];
}
