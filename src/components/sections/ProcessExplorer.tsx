"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { ProcessStage } from "@/types/content";
import { cn } from "@/lib/utilities";

/**
 * Interactive process diagram (desktop): a vertical tab list of stages beside a detail panel,
 * following the WAI-ARIA tabs pattern (arrow keys, Home/End, roving tabindex).
 * A closing rail shows the loop from the last stage back to the first.
 */
export function ProcessExplorer({ stages }: { stages: ProcessStage[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  function focusTab(index: number) {
    const next = (index + stages.length) % stages.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, () => void> = {
      ArrowDown: () => focusTab(index + 1),
      ArrowRight: () => focusTab(index + 1),
      ArrowUp: () => focusTab(index - 1),
      ArrowLeft: () => focusTab(index - 1),
      Home: () => focusTab(0),
      End: () => focusTab(stages.length - 1),
    };
    const handler = keys[e.key];
    if (handler) {
      e.preventDefault();
      handler();
    }
  }

  const stage = stages[active];

  return (
    <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-[var(--gutter)]">
      <div className="relative self-start pl-6">
        {/* Loop rail: from the last stage back to the first */}
        <span
          aria-hidden
          className="absolute top-7 bottom-7 left-0 w-3 rounded-l-md border-y border-l border-line-strong"
        />
        <div role="tablist" aria-label="Process stages" aria-orientation="vertical" className="flex flex-col">
          {stages.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`${baseId}-tab-${s.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group flex min-h-14 items-center gap-4 border-b border-line text-left transition-colors duration-[var(--duration-fast)]",
                  i === 0 && "border-t",
                  selected ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "type-meta flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-[var(--duration-base)]",
                    selected ? "border-accent bg-accent-solid text-white" : "border-line-strong",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[1.25rem] tracking-[-0.02em]">{s.name}</span>
                <span
                  aria-hidden
                  className={cn(
                    "ml-auto h-px bg-accent transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out)]",
                    selected ? "w-10" : "w-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${stage.id}`}
        tabIndex={0}
        className="rounded-[var(--radius-lg)] border border-line bg-surface p-8 lg:p-10"
      >
        <div key={stage.id} className="anim-fade">
          <p className="type-meta">
            Stage {active + 1} of {stages.length}
          </p>
          <h3 className="type-h2 mt-3">{stage.name}</h3>
          <p className="mt-5 text-lg leading-relaxed text-muted">{stage.description}</p>
          <dl className="mt-8 grid gap-6 border-t border-line pt-6">
            <div>
              <dt className="type-label">Expected output</dt>
              <dd className="mt-1.5">{stage.output}</dd>
            </div>
            {stage.example && (
              <div>
                <dt className="type-label">For example</dt>
                <dd className="mt-1.5 text-muted">{stage.example}</dd>
              </div>
            )}
          </dl>
          <p className="mt-8 text-sm text-subtle">
            Next: {stages[(active + 1) % stages.length].name}
            {active === stages.length - 1 && " — the loop begins again"}
          </p>
        </div>
      </div>
    </div>
  );
}
