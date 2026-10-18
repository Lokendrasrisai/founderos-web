import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isPreviewMode } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  // Preview builds (drafts / demo fixtures) must never be indexed.
  if (isPreviewMode()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
