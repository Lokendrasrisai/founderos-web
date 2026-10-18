import { isPreviewMode } from "@/lib/content";

/** Visible on every page whenever drafts and DEMO_ONLY fixtures are being rendered. */
export function PreviewBanner() {
  if (!isPreviewMode()) return null;
  return (
    <div className="bg-[var(--color-warn-bg)] text-[var(--color-warn-fg)]">
      <p className="container-site py-2 text-sm">
        <strong className="font-semibold">Preview build.</strong> Drafts and demo fixtures are shown and
        marked. None of it is real, and this build is not indexed.
      </p>
    </div>
  );
}
