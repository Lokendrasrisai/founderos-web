import type { Metadata } from "next";
import { site } from "@/config/site";
import { isPreviewMode } from "@/lib/content";

interface PageMetaInput {
  title?: string;
  description?: string;
  /** Route path beginning with "/". */
  path: string;
  /** Force noindex (e.g. demo/draft records). */
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}

/**
 * Builds consistent page metadata. Canonical and absolute URLs are only emitted when a real domain
 * is configured (NEXT_PUBLIC_SITE_URL) — we never point canonicals at a guessed domain.
 */
export function pageMetadata({
  title,
  description = site.description,
  path,
  noIndex = false,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
  const hideFromIndex = noIndex || isPreviewMode();

  return {
    // The root layout's template appends " — {site.name}".
    title: title ?? { absolute: fullTitle },
    description,
    alternates: site.url ? { canonical: path } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(site.url ? { url: path } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: hideFromIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
