import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getArticles, getProjects, getSectionAvailability, isPreviewMode } from "@/lib/content";

/**
 * Sitemap of published pages only. Empty sections, drafts and demo content are excluded.
 * Requires NEXT_PUBLIC_SITE_URL; without a real domain there is nothing truthful to list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url || isPreviewMode()) return [];
  const base = site.url;
  const available = getSectionAvailability();
  const paths = [
    "/",
    "/about",
    available.expertise && "/expertise",
    available.work && "/work",
    available.research && "/research",
    "/join",
    "/contact",
    "/privacy",
  ].filter((p): p is string => Boolean(p));

  return [
    ...paths.map((p) => ({ url: `${base}${p === "/" ? "" : p}` })),
    ...getProjects().map((p) => ({ url: `${base}/work/${p.slug}` })),
    ...getArticles().map((a) => ({
      url: `${base}/research/${a.slug}`,
      lastModified: a.updatedAt ?? a.publishedAt,
    })),
  ];
}
