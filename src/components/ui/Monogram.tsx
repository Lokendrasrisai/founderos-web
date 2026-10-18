import { site } from "@/config/site";
import { cn } from "@/lib/utilities";

/**
 * The brand mark: the configured monogram set inside a registration frame — four corner ticks,
 * the kind used to align plates precisely. Change the letter in src/config/site.ts.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square">
        <path d="M2 9V2h7M23 2h7v7M30 23v7h-7M9 30H2v-7" />
      </g>
      <rect x="9" y="9" width="14" height="14" rx="1.5" fill="var(--color-accent-solid)" />
      <text
        x="16"
        y="20.25"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize="11"
        fontWeight="600"
        fill="#fff"
      >
        {site.monogram}
      </text>
    </svg>
  );
}
