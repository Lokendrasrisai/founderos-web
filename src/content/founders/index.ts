import type { Founder } from "@/types/content";

/**
 * PRODUCTION founder profiles.
 *
 * Empty on purpose: no founder has supplied and approved a profile yet.
 * Add one record per founder (see docs/CONTENT_GUIDE.md → "Add a founder").
 * A profile renders only when governance.approval === "approved" and verification === "verified".
 */
export const founders: Founder[] = [];
