import type { ReactNode } from "react";

export interface TimelineItem {
  id: string;
  title: string;
  body: ReactNode;
  meta?: ReactNode;
}

/**
 * Timeline: an ordered sequence with a continuous rail. Use only for content that is actually a sequence.
 */
export function Timeline({ items, start = 1 }: { items: TimelineItem[]; start?: number }) {
  return (
    <ol className="relative" start={start}>
      {items.map((item, i) => (
        <li key={item.id} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 pb-9 last:pb-0">
          {i < items.length - 1 && (
            <span aria-hidden className="absolute top-8 bottom-0 left-[1.0625rem] w-px bg-line-strong" />
          )}
          <span
            aria-hidden
            className="type-meta relative flex size-[2.25rem] items-center justify-center rounded-full border border-line-strong bg-bg text-muted"
          >
            {String(i + start).padStart(2, "0")}
          </span>
          <div className="pt-1.5">
            <h3 className="type-h3 text-[1.125rem]">{item.title}</h3>
            <div className="mt-2 text-muted">{item.body}</div>
            {item.meta && <div className="mt-3">{item.meta}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
