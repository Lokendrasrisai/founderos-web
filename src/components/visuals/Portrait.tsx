import Image from "next/image";
import type { Founder } from "@/types/content";
import { cn } from "@/lib/utilities";

/**
 * Consistent 4:5 portrait frame. Real photos get a uniform tonal treatment; founders without an approved
 * photo get an initial on a quiet field — never a stock or generated face.
 */
export function Portrait({
  founder,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  founder: Founder;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "portrait relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface",
        className,
      )}
    >
      {founder.photo ? (
        <Image
          src={founder.photo.src}
          alt={founder.photo.alt}
          width={founder.photo.width}
          height={founder.photo.height}
          sizes={sizes}
          className="portrait-img h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden className="flex h-full w-full items-end p-5">
          <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full text-line">
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={i}
                x1={i * 12.5}
                x2={i * 12.5}
                y1="0"
                y2="125"
                stroke="currentColor"
                strokeWidth="0.4"
              />
            ))}
          </svg>
          <span className="relative text-[clamp(3rem,8vw,5rem)] leading-none font-medium tracking-[-0.05em] text-[color-mix(in_srgb,var(--color-fg)_22%,transparent)]">
            {founder.name
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
      )}
    </div>
  );
}
