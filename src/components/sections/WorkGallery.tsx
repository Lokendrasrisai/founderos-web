"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utilities";

export interface GalleryItem {
  slug: string;
  disciplines: string[];
  type: string;
  /** Server-rendered card. */
  card: ReactNode;
}

interface Option {
  value: string;
  label: string;
}

/**
 * Work gallery with simple filters by discipline and project type. Filters are toggle buttons
 * (aria-pressed); the result count is announced politely. Without JavaScript every project is listed.
 */
export function WorkGallery({
  items,
  disciplines,
  types,
}: {
  items: GalleryItem[];
  disciplines: Option[];
  types: Option[];
}) {
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      items.filter((i) => (!discipline || i.disciplines.includes(discipline)) && (!type || i.type === type)),
    [items, discipline, type],
  );

  const showFilters = items.length >= 3 && (disciplines.length > 1 || types.length > 1);

  return (
    <div>
      {showFilters && (
        <div className="mb-12 grid gap-6 border-y border-line py-6 md:grid-cols-12 md:gap-[var(--gutter)]">
          <FilterGroup
            label="Discipline"
            options={disciplines}
            value={discipline}
            onChange={setDiscipline}
            className="md:col-span-8"
          />
          <FilterGroup
            label="Type"
            options={types}
            value={type}
            onChange={setType}
            className="md:col-span-4"
          />
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      {visible.length > 0 ? (
        <ul className="grid gap-x-[var(--gutter)] gap-y-16 md:grid-cols-2">
          {visible.map((i) => (
            <li key={i.slug}>{i.card}</li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-10 text-muted">
          <p>No projects match both filters.</p>
          <button
            type="button"
            onClick={() => {
              setDiscipline(null);
              setType(null);
            }}
            className="link mt-3"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (v: string | null) => void;
  className?: string;
}) {
  if (options.length < 2) return null;
  const all = [{ value: "", label: "All" }, ...options];
  return (
    <fieldset className={className}>
      <legend className="type-label mb-3">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {all.map((o) => {
          const pressed = (value ?? "") === o.value;
          return (
            <button
              key={o.value || "all"}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(o.value || null)}
              className={cn(
                "inline-flex min-h-9 items-center rounded-[var(--radius-sm)] border px-3 text-sm transition-colors duration-[var(--duration-fast)]",
                pressed
                  ? "border-accent bg-[color-mix(in_srgb,var(--color-accent-solid)_16%,transparent)] text-fg"
                  : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
